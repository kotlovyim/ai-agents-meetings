"use client";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import {
    useMutation,
    useQueryClient,
    useSuspenseQuery,
} from "@tanstack/react-query";
import { MeetingIdViewHeader } from "../components/meeting-id-view-header";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/modules/agents/hooks/use-confirm";
import { toast } from "sonner";
import { useState } from "react";
import { UpdateMeetingDialog } from "../components/update-meeting-dialog";
import { UpcomingState } from "../components/upcoming-state";
import { ActiveState } from "../components/active-state";
import { CancelledState } from "../components/cancelled-state";
import { ProcessingState } from "../components/processing-state";

interface Props {
    meetingId: string;
}

export const MeetingIdView = ({ meetingId }: Props) => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const router = useRouter();

    const { data } = useSuspenseQuery(
        trpc.meetings.getOne.queryOptions({ id: meetingId }),
    );

    const removeAgent = useMutation(
        trpc.meetings.remove.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries(
                    trpc.meetings.getMany.queryOptions({}),
                );
                router.push("/meetings");
                4;
                toast.success("Meeting removed successfully");
            },
            onError: (error) => {
                toast.error(error.message);
            },
        }),
    );

    const [ConfirmDialog, confirm] = useConfirm(
        "Confirm Removal",
        `Are you sure you want to remove this meeting?`,
    );

    const [meetingUpdateDialog, setMeetingUpdateDialog] = useState(false);

    const handleRemoveMeeting = async () => {
        const confirmed = await confirm();
        if (confirmed) {
            removeAgent.mutate({ id: meetingId });
        }
    };

    const isActive = data.status == "active";
    const isUpcoming = data.status == "upcoming";
    const isCancelled = data.status == "cancelled";
    const isCompleted = data.status == "completed";
    const isProcessing = data.status == "processing";

    return (
        <>
            <UpdateMeetingDialog
                open={meetingUpdateDialog}
                onOpenChange={setMeetingUpdateDialog}
                initialValues={data!}
            />
            <ConfirmDialog />
            <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
                <MeetingIdViewHeader
                    meetingId={meetingId}
                    meetingName={data?.name ?? ""}
                    onEdit={() => setMeetingUpdateDialog(true)}
                    onRemove={handleRemoveMeeting}
                />
                {isActive && <ActiveState meetingId={meetingId} />}
                {isUpcoming && (
                    <UpcomingState
                        meetingId={meetingId}
                        onCancelMeeting={handleRemoveMeeting}
                        isCancelling={false}
                    />
                )}
                {isCancelled && <CancelledState />}
                {isCompleted && <div>Meeting is Completed</div>}
                {isProcessing && <ProcessingState />}
            </div>
        </>
    );
};

export const MeetingIdViewLoading = () => {
    return (
        <LoadingState
            title="Loading meeting..."
            description="Please wait while we load the meeting."
        />
    );
};

export const MeetingIdViewError = () => {
    return (
        <ErrorState
            title="Failed to load meeting"
            description="An error occurred while loading the meeting. Please try again."
        />
    );
};
