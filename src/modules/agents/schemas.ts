import { z } from "zod";

export const agentsInsertSchema = z.object({
    name: z
        .string()
        .min(1, { message: "Name is required" })
        .max(100, { message: "Name must be at most 100 characters" }),
    instructions: z.string().min(1, { message: "Instructions are required" }),
});
