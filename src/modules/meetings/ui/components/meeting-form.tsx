import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import z from "zod";
import { meetingsInsertSchema } from "../../schemas";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MeetingGetOne } from "../../types";
import { useState } from "react";

import { GeneratedAvatar } from "@/components/generated-avatar";
import { CommandSelect } from "@/components/command-select";
import { NewAgentDialog } from "@/modules/agents/ui/components/new-agent-dialog";

interface MeetingFormProps {
    onSuccess?: (id?: string) => void;
    onCancel?: () => void;
    initialValues?: MeetingGetOne;
}

export const MeetingForm = ({
    onSuccess,
    onCancel,
    initialValues,
}: MeetingFormProps) => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const [agentSearch, setAgentSearch] = useState("");
    const [openNewAgentDialog, setOpenNewAgentDialog] = useState(false);

    const agents = useQuery(
        trpc.agents.getMany.queryOptions({
            pageSize: 100,
            search: agentSearch,
        }),
    );

    const createMeeting = useMutation(
        trpc.meetings.create.mutationOptions({
            onSuccess: (data) => {
                queryClient.invalidateQueries(
                    trpc.meetings.getMany.queryOptions({}),
                );
                onSuccess?.(data.id);
            },
            onError: (error) => {
                toast.error(error.message);
            },
        }),
    );

    const updateMeeting = useMutation(
        trpc.meetings.update.mutationOptions({
            onSuccess: (data) => {
                queryClient.invalidateQueries(
                    trpc.meetings.getMany.queryOptions({}),
                );
                queryClient.invalidateQueries(
                    trpc.meetings.getOne.queryOptions({
                        id: data.id,
                    }),
                );
                onSuccess?.(data.id);
            },
            onError: (error) => {
                toast.error(error.message);
            },
        }),
    );

    const form = useForm<z.infer<typeof meetingsInsertSchema>>({
        resolver: zodResolver(meetingsInsertSchema),
        defaultValues: {
            name: initialValues?.name || "",
            agentId: initialValues?.agentId || "",
        },
    });

    const isEdit = !!initialValues?.id;
    const isPending = isEdit
        ? updateMeeting.isPending
        : createMeeting.isPending;

    const onSubmit = async (data: z.infer<typeof meetingsInsertSchema>) => {
        if (isEdit) {
            updateMeeting.mutate({ id: initialValues!.id, ...data });
        } else {
            createMeeting.mutate(data);
        }
    };
    return (
        <>
            <NewAgentDialog
                open={openNewAgentDialog}
                onOpenChange={setOpenNewAgentDialog}
            />
            <Form {...form}>
                <form
                    className="space-y-4"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g. Meeting with Bob"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />
                    <FormField
                        control={form.control}
                        name="agentId"
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>Agent</FormLabel>
                                    <FormControl>
                                        <CommandSelect
                                            options={(
                                                agents.data?.items ?? []
                                            ).map((agent) => ({
                                                id: agent.id,
                                                value: agent.name,
                                                children: (
                                                    <div className="flex items-center gap-x-2">
                                                        <GeneratedAvatar
                                                            seed={agent.name}
                                                            variant="botttsNeutral"
                                                            className="border size-6"
                                                        />
                                                        <span>
                                                            {agent.name}
                                                        </span>
                                                    </div>
                                                ),
                                            }))}
                                            onSelect={(value) =>
                                                field.onChange(value)
                                            }
                                            onSearch={(value) =>
                                                setAgentSearch(value)
                                            }
                                            value={field.value}
                                            placeholder="Select an agent"
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Not found what you&apos;re looking for?{" "}
                                        <button
                                            type="button"
                                            className=" text-primary hover:underline"
                                            onClick={() =>
                                                setOpenNewAgentDialog(true)
                                            }
                                        >
                                            Create a new agent
                                        </button>
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />
                    <div className="flex justify-between gap-x-2">
                        {onCancel && (
                            <Button
                                variant="ghost"
                                disabled={isPending}
                                onClick={() => onCancel()}
                                type="button"
                            >
                                Cancel
                            </Button>
                        )}
                        <Button disabled={isPending} type="submit">
                            {isEdit ? "Save Changes" : "Create Meeting"}
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    );
};
