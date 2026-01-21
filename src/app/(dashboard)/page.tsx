import { auth } from "@/lib/auth";
import Home, {
    HomeViewLoading,
    HomeViewError,
} from "@/modules/home/ui/views/home-view";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const Page = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }

    const queryClient = getQueryClient();

    void queryClient.prefetchQuery(
        trpc.meetings.getMany.queryOptions({ pageSize: 100 }),
    );

    void queryClient.prefetchQuery(
        trpc.agents.getMany.queryOptions({ pageSize: 100 }),
    );

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<HomeViewLoading />}>
                <ErrorBoundary fallback={<HomeViewError />}>
                    <Home />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    );
};

export default Page;
