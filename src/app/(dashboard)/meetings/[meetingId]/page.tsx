import { auth } from "@/lib/auth";
import {
    MeetingIdView,
    MeetingIdViewError,
    MeetingIdViewLoading,
} from "@/modules/meetings/ui/views/meeting-id-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

interface Props {
    params: Promise<{ meetingId: string }>;
}

const Page = async ({ params }: Props) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }

    const { meetingId } = await params;

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(
        trpc.meetings.getOne.queryOptions({ id: meetingId }),
    );

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<MeetingIdViewLoading />}>
                <ErrorBoundary fallback={<MeetingIdViewError />}>
                    <MeetingIdView meetingId={meetingId} />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    );
};

export default Page;
