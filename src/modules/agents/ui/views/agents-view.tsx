"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DataTable } from "../components/data-table";
import { columns } from "../components/columns";
import { LoadingState } from "@/components/loading-state";
import { EmptyState } from "@/components/empty-state";

export const AgentsView = () => {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());

    return (
        <div className="flex-1 pb-4 md:px-8 flex flex-col gap-y-4">
            <DataTable data={data} columns={columns} />
            {data.length === 0 && (
                <EmptyState
                    title="No Agents Found"
                    description="Create an agent to join your meetings and assist you. Each agent can help you with different tasks and interact with participants during the call."
                />
            )}
        </div>
    );
};

export const AgentsViewLoading = () => {
    return (
        <LoadingState
            title="Loading agents"
            description="Fetching your AI agents..."
        />
    );
};
