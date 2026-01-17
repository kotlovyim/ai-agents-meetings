import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { meetings } from "@/db/schema";
import { db } from "@/db";
import z from "zod";
import { eq, ilike, desc, count, and } from "drizzle-orm";
import {
    DEFAULT_PAGE,
    DEFAULT_PAGE_SIZE,
    MAX_PAGE_SIZE,
    MIN_PAGE_SIZE,
} from "@/constants";
import { TRPCError } from "@trpc/server";

export const meetingsRouter = createTRPCRouter({
    getOne: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input, ctx }) => {
            const [existingMeeting] = await db
                .select()
                .from(meetings)
                .where(
                    and(
                        eq(meetings.id, input.id),
                        eq(meetings.userId, ctx.userId),
                    ),
                );
            if (!existingMeeting) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Meeting not found",
                });
            }
            return existingMeeting;
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
            }),
        )
        .query(async ({ input, ctx }) => {
            const { search, page, pageSize } = input;
            const data = await db
                .select()
                .from(meetings)
                .where(
                    and(
                        eq(meetings.userId, ctx.userId),
                        search
                            ? ilike(meetings.name, `%${search}%`)
                            : undefined,
                    ),
                )
                .orderBy(desc(meetings.createdAt))
                .limit(pageSize)
                .offset((page - 1) * pageSize);
            const [total] = await db
                .select({ count: count() })
                .from(meetings)
                .where(
                    and(
                        eq(meetings.userId, ctx.userId),
                        search
                            ? ilike(meetings.name, `%${search}%`)
                            : undefined,
                    ),
                );
            const totalPages = Math.ceil(total.count / pageSize);
            return { items: data, total: total.count, totalPages };
        }),
});
