"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DataTable } from "../components/data-table";
import { columns } from "../components/columns";
import { LoadingState } from "@/components/loading-state";
import { EmptyState } from "@/components/empty-state";
import { useAgentsFilters } from "../../hooks/use-agents-filters";
import { DataPagination } from "../components/data-pagination";
import { useRouter } from "next/navigation";
import { ErrorState } from "@/components/error-state";

export const AgentsView = () => {
    const [filters, setFilters] = useAgentsFilters();
    const trpc = useTRPC();
    const router = useRouter();
    const { data } = useSuspenseQuery(
        trpc.agents.getMany.queryOptions({ ...filters })
    );

    return (
        <div className="flex-1 pb-4 md:px-8 flex flex-col gap-y-4">
            <DataTable
                data={data.items}
                columns={columns}
                onRowClick={(row) => {
                    router.push(`/agents/${row.id}`);
                }}
            />
            <DataPagination
                page={filters.page}
                totalPages={data.totalPages}
                onPageChange={(page) => setFilters({ page })}
            />
            {data.total === 0 && (
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

export const AgentsViewError = () => {
    return (
        <ErrorState
            title="Failed to load agents"
            description="Please try again later."
        />
    );
};
