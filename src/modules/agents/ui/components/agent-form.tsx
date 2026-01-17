import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AgentGetOne } from "../../types";
import { useForm } from "react-hook-form";
import z from "zod";
import { agentsInsertSchema } from "../../schemas";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AgentFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    initialValues?: AgentGetOne;
}

export const AgentForm = ({
    onSuccess,
    onCancel,
    initialValues,
}: AgentFormProps) => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const createAgent = useMutation(
        trpc.agents.create.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries(
                    trpc.agents.getMany.queryOptions({})
                );
                if (initialValues?.id) {
                    queryClient.invalidateQueries(
                        trpc.agents.getOne.queryOptions({
                            id: initialValues.id,
                        })
                    );
                }
                onSuccess?.();
            },
            onError: (error) => {
                toast.error(error.message);
            },
        })
    );

    const form = useForm<z.infer<typeof agentsInsertSchema>>({
        resolver: zodResolver(agentsInsertSchema),
        defaultValues: {
            name: initialValues?.name || "",
            instructions: initialValues?.instructions || "",
        },
    });

    const isEdit = !!initialValues?.id;
    const isPending = createAgent.isPending;

    const onSubmit = async (data: z.infer<typeof agentsInsertSchema>) => {
        if (isEdit) {
            // Edit logic to be implemented
        } else {
            createAgent.mutate(data);
        }
    };
    return (
        <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <GeneratedAvatar
                    seed={form.watch("name")}
                    variant="botttsNeutral"
                />
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="e.g. Meeting Assistant"
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
                    name="instructions"
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <FormLabel>Instructions</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="e.g. You are a helpful meeting assistant..."
                                        {...field}
                                        className="max-h-[120px] lg:max-h-[320px]"
                                    />
                                </FormControl>
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
                        {isEdit ? "Save Changes" : "Create Agent"}
                    </Button>
                </div>
            </form>
        </Form>
    );
};
