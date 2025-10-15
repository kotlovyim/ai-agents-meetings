"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const AgentsView = () => {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());

    return (
        <div>
            {data ? (
                data.map((agent) => <div key={agent.id}>{agent.name}</div>)
            ) : (
                "Loading..."
            )}
        </div>
    );
};
