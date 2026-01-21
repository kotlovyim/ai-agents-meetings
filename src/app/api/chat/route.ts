import { NextRequest } from "next/server";
import OpenAI from "openai";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { meetings } from "@/db/schema";
import { and, eq } from "drizzle-orm";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { meetingId, messages } = await req.json();

    const [meeting] = await db
        .select()
        .from(meetings)
        .where(
            and(
                eq(meetings.id, meetingId),
                eq(meetings.userId, session.user.id),
            ),
        );

    if (!meeting) {
        return new Response("Meeting not found", { status: 404 });
    }

    const systemMessage = `You are a helpful assistant analyzing a meeting. Here is the meeting summary:

${meeting.summary || "No summary available"}

${
    meeting.transcript
        ? `And here is the full transcript:

${meeting.transcript}`
        : ""
}

Answer questions about this meeting based on the information provided.`;

    const stream = await openai.chat.completions.create({
        model: "gpt-5-mini",
        messages: [{ role: "system", content: systemMessage }, ...messages],
        stream: true,
    });

    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
        async start(controller) {
            for await (const chunk of stream) {
                const content = chunk.choices[0]?.delta?.content || "";
                if (content) {
                    controller.enqueue(encoder.encode(content));
                }
            }
            controller.close();
        },
    });

    return new Response(readableStream, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
        },
    });
}
