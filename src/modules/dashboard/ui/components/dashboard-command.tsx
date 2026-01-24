"use client";

import {
    CommandResponsiveDialog,
    CommandInput,
    CommandItem,
    CommandList,
    CommandEmpty,
    CommandGroup,
} from "@/components/ui/command";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { BotIcon, VideoIcon, LoaderIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { GeneratedAvatar } from "@/components/generated-avatar";

interface Props {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

export const DashboardCommand = ({ open, setOpen }: Props) => {
    const [search, setSearch] = useState("");
    const router = useRouter();
    const trpc = useTRPC();

    useEffect(() => {
        if (!open) {
            setSearch("");
        }
    }, [open]);

    const { data: agents, isLoading: agentsLoading } = useQuery({
        ...trpc.agents.getMany.queryOptions({
            pageSize: 10,
            search: search || undefined,
        }),
        enabled: open,
    });

    const { data: meetings, isLoading: meetingsLoading } = useQuery({
        ...trpc.meetings.getMany.queryOptions({
            pageSize: 10,
            search: search || undefined,
        }),
        enabled: open,
    });

    const isLoading = agentsLoading || meetingsLoading;
    const hasResults =
        (agents?.items && agents.items.length > 0) ||
        (meetings?.items && meetings.items.length > 0);

    const handleSelect = (path: string) => {
        setOpen(false);
        router.push(path);
    };

    return (
        <CommandResponsiveDialog
            open={open}
            onOpenChange={setOpen}
            shouldFilter={false}
            title="Quick Search"
            description="Search for meetings and agents"
        >
            <CommandInput
                placeholder="Search meetings and agents..."
                value={search}
                onValueChange={setSearch}
            />
            <CommandList>
                {isLoading && (
                    <div className="flex items-center justify-center py-6">
                        <LoaderIcon className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                )}

                {!isLoading && !hasResults && (
                    <CommandEmpty>
                        {search
                            ? "No results found."
                            : "Start typing to search..."}
                    </CommandEmpty>
                )}

                {!isLoading && agents?.items && agents.items.length > 0 && (
                    <CommandGroup heading="Agents">
                        {agents.items.map((agent) => (
                            <CommandItem
                                key={agent.id}
                                value={agent.id}
                                onSelect={() =>
                                    handleSelect(`/agents/${agent.id}`)
                                }
                                className="flex items-center gap-3"
                            >
                                <GeneratedAvatar
                                    seed={agent.id}
                                    className="h-8 w-8"
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium truncate">
                                        {agent.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground truncate">
                                        {agent.meetingsCount}{" "}
                                        {agent.meetingsCount === 1
                                            ? "meeting"
                                            : "meetings"}
                                    </div>
                                </div>
                                <BotIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            </CommandItem>
                        ))}
                    </CommandGroup>
                )}

                {!isLoading && meetings?.items && meetings.items.length > 0 && (
                    <CommandGroup heading="Meetings">
                        {meetings.items.map((meeting) => (
                            <CommandItem
                                key={meeting.id}
                                value={meeting.id}
                                onSelect={() =>
                                    handleSelect(`/meetings/${meeting.id}`)
                                }
                                className="flex items-center gap-3"
                            >
                                <GeneratedAvatar
                                    seed={meeting.agent.id}
                                    className="h-8 w-8"
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium truncate">
                                        {meeting.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground truncate">
                                        {meeting.agent.name} •{" "}
                                        {meeting.status}
                                    </div>
                                </div>
                                <VideoIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            </CommandItem>
                        ))}
                    </CommandGroup>
                )}
            </CommandList>
        </CommandResponsiveDialog>
    );
};
