"use client";
import { DataTable } from "@/components/data-table";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { columns } from "../components/columns";
import { EmptyState } from "@/components/empty-state";
import { useRouter } from "next/navigation";
import { useMeetingsFilters } from "../../hooks/use-meetings-filter";
import { DataPagination } from "@/components/data-pagination";
export const MeetingsView = () => {
    const router = useRouter();
    const [filters, setFilters] = useMeetingsFilters();

    const trpc = useTRPC();
    const { data } = useSuspenseQuery(
        trpc.meetings.getMany.queryOptions({ ...filters }),
    );

    return (
        <div className="flex-1 px-4 pb-4 md:px-8 flex flex-col gap-y-4">
            <DataTable
                data={data.items}
                columns={columns}
                onRowClick={(row) => router.push(`/meetings/${row.id}`)}
            />
            <DataPagination
                page={filters.page}
                totalPages={data.totalPages}
                onPageChange={(page) => setFilters({ page })}
            />
            {data.total === 0 && (
                <EmptyState
                    title="Create Your First Meeting"
                    description="Shedule meetings and invite your AI agents to assist you during calls. Each meeting lets you collaborate, share ideas, and interact with participants in real-time."
                />
            )}
        </div>
    );
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
