import {
    createTRPCRouter,
    baseProcedure,
    protectedProcedure,
} from "@/trpc/init";
import { agents } from "@/db/schema";
import { db } from "@/db";
import { agentsInsertSchema } from "../schemas";
import z, { number } from "zod";
import { eq, getTableColumns, sql } from "drizzle-orm";

export const agentsRouter = createTRPCRouter({
    getOne: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input }) => {
            const [existingAgent] = await db
                .select({
                    ...getTableColumns(agents),
                })
                .from(agents)
                .where(eq(agents.id, input.id));
            return existingAgent;
        }),
    getMany: protectedProcedure.query(async () => {
        return await db.select().from(agents);
    }),
    create: protectedProcedure
        .input(agentsInsertSchema)
        .mutation(async ({ input, ctx }) => {
            const [createdAgent] = await db
                .insert(agents)
                .values({
                    ...input,
                    userId: ctx.userId,
                })
                .returning();
            return createdAgent;
        }),
});
