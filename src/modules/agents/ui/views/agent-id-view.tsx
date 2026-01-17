"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import {
    useMutation,
    useQueryClient,
    useSuspenseQuery,
} from "@tanstack/react-query";
import { AgentIdViewHeader } from "../components/agent-id-view-header";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Badge } from "@/components/ui/badge";
import { VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfirm } from "../../hooks/use-confirm";
import { useState } from "react";
import { UpdateAgentDialog } from "../components/update-agent-dialog";

interface Props {
    agentId: string;
}

export const AgentIdView = ({ agentId }: Props) => {
    const trpc = useTRPC();
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data } = useSuspenseQuery(
        trpc.agents.getOne.queryOptions({ id: agentId }),
    );

    const removeAgent = useMutation(
        trpc.agents.remove.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries(
                    trpc.agents.getMany.queryOptions({}),
                );
                router.push("/agents");
            },
            onError: (error) => {
                toast.error(error.message);
            },
        }),
    );

    const [ConfirmDialog, confirm] = useConfirm(
        "Confirm Removal",
        `The following action will remove ${data.meetingsCount} associated meetings. Are you sure you want to proceed?`,
    );

    const [agentUpdateDialog, setAgentUpdateDialog] = useState(false);

    return (
        <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
            <AgentIdViewHeader
                agentId={agentId}
                agentName={data.name}
                onEdit={() => setAgentUpdateDialog(true)}
                onRemove={async () => {
                    const confirmed = await confirm();
                    if (confirmed) {
                        removeAgent.mutate({ id: agentId });
                    }
                }}
            />
            <div className="bg-white rounded-lg border">
                <div className="px-4 py-5 gap-y-5 flex flex-col col-span-5">
                    <div className="flex items-center gap-x-3">
                        <GeneratedAvatar
                            variant="botttsNeutral"
                            seed={data.name}
                            className="size-10"
                        />
                        <h2 className="text-2xl font-medium">{data.name}</h2>
                    </div>
                    <Badge
                        variant="outline"
                        className="flex items-center gap-x-2 [&>svg]:size-4"
                    >
                        <VideoIcon className="text-blue-700" />
                        {data.meetingsCount}
                        {data.meetingsCount === 1 ? " Meeting" : " Meetings"}
                    </Badge>
                    <div className="flex flex-col gap-y-4">
                        <p className="text-lg font-medium">Instructions</p>
                        <p className="text-muted-foreground text-sm">
                            {data.instructions}
                        </p>
                    </div>
                </div>
            </div>
            <ConfirmDialog />
            <UpdateAgentDialog
                open={agentUpdateDialog}
                onOpenChange={setAgentUpdateDialog}
                initialValues={data}
            />
        </div>
    );
};

export const AgentIdViewLoading = () => {
    return (
        <LoadingState
            title="Loading agents"
            description="Fetching your AI agents..."
        />
    );
};

export const AgentIdViewError = () => {
    return (
        <ErrorState
            title="Failed to load agents"
            description="Please try again later."
        />
    );
};
