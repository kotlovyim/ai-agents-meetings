import { z } from "zod";

export const meetingsInsertSchema = z.object({
    name: z
        .string()
        .min(1, { message: "Name is required" })
        .max(100, { message: "Name must be at most 100 characters" }),
    agentId: z.string().min(1, { message: "Agent is required" }),
});

export const meetingsUpdateSchema = meetingsInsertSchema.extend({
    id: z.string().min(1, { message: "ID is required" }),
});
