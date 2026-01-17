import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { agents } from "@/db/schema";
import { db } from "@/db";
import { agentsInsertSchema } from "../schemas";
import z from "zod";
import { eq, getTableColumns, sql, and, ilike, desc, count } from "drizzle-orm";
import {
    DEFAULT_PAGE,
    DEFAULT_PAGE_SIZE,
    MAX_PAGE_SIZE,
    MIN_PAGE_SIZE,
} from "@/constants";
import { TRPCError } from "@trpc/server";

export const agentsRouter = createTRPCRouter({
    getOne: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input, ctx }) => {
            const [existingAgent] = await db
                .select({
                    ...getTableColumns(agents),
                    meetingsCount: sql<number>`5`,
                })
                .from(agents)
                .where(
                    and(eq(agents.id, input.id), eq(agents.userId, ctx.userId))
                );
            if (!existingAgent) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Agent not found",
                });
            }
            return existingAgent;
        }),
    getMany: protectedProcedure
        .input(
            z.object({
                page: z.number().default(DEFAULT_PAGE),
                pageSize: z
                    .number()
                    .min(MIN_PAGE_SIZE)
                    .max(MAX_PAGE_SIZE)
                    .default(DEFAULT_PAGE_SIZE),
                search: z.string().nullish(),
            })
        )
        .query(async ({ input, ctx }) => {
            const { search, page, pageSize } = input;
            const data = await db
                .select({
                    ...getTableColumns(agents),
                    meetingsCount: sql<number>`5`,
                })
                .from(agents)
                .where(
                    and(
                        eq(agents.userId, ctx.userId),
                        search ? ilike(agents.name, `%${search}%`) : undefined
                    )
                )
                .orderBy(desc(agents.createdAt))
                .limit(pageSize)
                .offset((page - 1) * pageSize);
            const [total] = await db
                .select({ count: count() })
                .from(agents)
                .where(
                    and(
                        eq(agents.userId, ctx.userId),
                        search ? ilike(agents.name, `%${search}%`) : undefined
                    )
                );
            const totalPages = Math.ceil(total.count / pageSize);
            return { items: data, total: total.count, totalPages };
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
