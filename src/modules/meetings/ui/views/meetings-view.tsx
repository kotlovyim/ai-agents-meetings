"use client";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const MeetingsView = () => {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({}));

    return <pre>{JSON.stringify(data, null, 2)}</pre>;
};

export const MeetingsViewLoading = () => {
    return (
        <LoadingState
            title="Loading meetings..."
            description="Please wait while we load the meetings."
        />
    );
};

export const MeetingsViewError = () => {
    return (
        <ErrorState
            title="Failed to load meetings"
            description="An error occurred while loading the meetings. Please try again."
        />
    );
};
