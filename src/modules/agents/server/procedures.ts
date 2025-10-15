import { createTRPCRouter , baseProcedure } from '@/trpc/init';
import { agents } from '@/db/schema';
import { db } from '@/db';

export const agentsRouter = createTRPCRouter({
  getMany: baseProcedure.query(async () => {
    return await db.select().from(agents);
  }),
});