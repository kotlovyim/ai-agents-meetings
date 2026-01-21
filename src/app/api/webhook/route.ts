import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { streamVideo } from "@/lib/stream-video";
import {
    CallRecordingReadyEvent,
    CallSessionEndedEvent,
    CallSessionParticipantLeftEvent,
    CallSessionStartedEvent,
    CallTranscriptionReadyEvent,
} from "@stream-io/node-sdk";
import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { inngest } from "@/inngest/client";

function verifySignatureWithSDK(body: string, signature: string): boolean {
    return streamVideo.verifyWebhook(body, signature);
}

export async function POST(req: NextRequest) {
    const signature = req.headers.get("x-signature");
    const apiKey = req.headers.get("x-api-key");

    if (!signature || !apiKey) {
        return NextResponse.json(
            { message: "Missing signature or API key" },
            { status: 400 },
        );
    }

    const body = await req.text();

    if (!verifySignatureWithSDK(body, signature)) {
        return NextResponse.json(
            { message: "Invalid signature" },
            { status: 401 },
        );
    }

    let payload: unknown;
    try {
        payload = JSON.parse(body);
    } catch {
        return NextResponse.json(
            { message: "Invalid JSON payload" },
            { status: 400 },
        );
    }
    const eventType = (payload as Record<string, unknown>)?.type;

    if (eventType === "call.session_started") {
        const event = payload as CallSessionStartedEvent;
        const meetingId = event.call.custom?.meetingId;

        if (!meetingId) {
            return NextResponse.json(
                { message: "Missing meeting ID in call custom data" },
                { status: 400 },
            );
        }
        const [existingMeeting] = await db
            .select()
            .from(meetings)
            .where(
                and(
                    eq(meetings.id, meetingId),
                    eq(meetings.status, "upcoming"),
                ),
            );

        if (!existingMeeting) {
            return NextResponse.json(
                {
                    message:
                        "Meeting not found or not in a valid state to start",
                },
                { status: 404 },
            );
        }
        await db
            .update(meetings)
            .set({ status: "active", startedAt: new Date() })
            .where(eq(meetings.id, existingMeeting.id));

        const [existingAgent] = await db
            .select()
            .from(agents)
            .where(eq(agents.id, existingMeeting.agentId));
        if (!existingAgent) {
            return NextResponse.json(
                { message: "Associated agent not found" },
                { status: 404 },
            );
        }

        const call = streamVideo.video.call("default", meetingId);

        try {
            const realtimeClient = await streamVideo.video.connectOpenAi({
                call,
                openAiApiKey: process.env.OPENAI_API_KEY!,
                agentUserId: existingAgent.id,
                model: "gpt-4o-realtime-preview",
            });

            realtimeClient.updateSession({
                instructions: existingAgent.instructions,
            });

            realtimeClient.on("error", (error: unknown) => {
                console.error("OpenAI Realtime API error:", error);
            });

            realtimeClient.on(
                "conversation.updated",
                (event: CallSessionStartedEvent) => {
                    console.log("Conversation updated:", event);
                },
            );
        } catch (error) {
            console.error("Failed to connect OpenAI agent:", error);
            return NextResponse.json(
                { message: "Failed to connect AI agent" },
                { status: 500 },
            );
        }
    } else if (eventType === "call.session_participant_left") {
        const event = payload as CallSessionParticipantLeftEvent;
        const meetingId = event.call_cid.split(":")[1];

        if (!meetingId) {
            return NextResponse.json(
                { message: "Missing meeting ID in call CID" },
                { status: 400 },
            );
        }
        const call = streamVideo.video.call("default", meetingId);
        await call.end();
    } else if (eventType === "call.session_ended") {
        const event = payload as CallSessionEndedEvent;
        const meetingId = event.call_cid.split(":")[1];

        if (!meetingId) {
            return NextResponse.json(
                { message: "Missing meeting ID in call CID" },
                { status: 400 },
            );
        }

        try {
            await db
                .update(meetings)
                .set({ status: "processing", endedAt: new Date() })
                .where(eq(meetings.id, meetingId));
        } catch (error) {
            console.error("Failed to process call:", error);
            return NextResponse.json(
                { message: "Failed to process call" },
                { status: 500 },
            );
        }
    } else if (eventType === "call.transcription_ready") {
        const event = payload as CallTranscriptionReadyEvent;
        const meetingId = event.call_cid.split(":")[1];

        if (!meetingId) {
            return NextResponse.json(
                { message: "Missing meeting ID in call CID" },
                { status: 400 },
            );
        }

        const [updatedMeeting] = await db
            .update(meetings)
            .set({ transcriptUrl: event.call_transcription.url })
            .where(eq(meetings.id, meetingId))
            .returning();

        if (!updatedMeeting) {
            return NextResponse.json(
                { message: "Meeting not found to update transcript" },
                { status: 404 },
            );
        }
        await inngest.send({
            name: "meetings/processing",
            data: {
                meetingId: updatedMeeting.id,
                transcriptUrl: updatedMeeting.transcriptUrl,
            },
        });
    } else if (eventType === "call.recording_ready") {
        const event = payload as CallRecordingReadyEvent;
        const meetingId = event.call_cid.split(":")[1];

        if (!meetingId) {
            return NextResponse.json(
                { message: "Missing meeting ID in call CID" },
                { status: 400 },
            );
        }

        const [updatedMeeting] = await db
            .update(meetings)
            .set({ recordingUrl: event.call_recording.url })
            .where(eq(meetings.id, meetingId))
            .returning();

        if (!updatedMeeting) {
            return NextResponse.json(
                { message: "Meeting not found to update recording" },
                { status: 404 },
            );
        }
    }
    return NextResponse.json({ status: "ok" });
}
