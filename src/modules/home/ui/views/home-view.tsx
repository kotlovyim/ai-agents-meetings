"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import {
    VideoIcon,
    BotIcon,
    CalendarCheckIcon,
    ClockIcon,
    TrendingUpIcon,
    SparklesIcon,
    ArrowRightIcon,
    CalendarIcon,
} from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { formatDuration } from "@/lib/utils";

export default function Home() {
    const { data: session } = authClient.useSession();
    const trpc = useTRPC();

    const { data: meetings } = useQuery(
        trpc.meetings.getMany.queryOptions({ pageSize: 100 })
    );

    const { data: agents } = useQuery(
        trpc.agents.getMany.queryOptions({ pageSize: 100 })
    );

    const totalMeetings = meetings?.total || 0;
    const totalAgents = agents?.total || 0;
    const completedMeetings =
        meetings?.items.filter((m) => m.status === "completed").length || 0;
    const upcomingMeetings =
        meetings?.items.filter((m) => m.status === "upcoming").length || 0;

    const totalDuration =
        meetings?.items
            .filter((m) => m.duration)
            .reduce((acc, m) => acc + (m.duration || 0), 0) || 0;

    const recentMeetings = meetings?.items.slice(0, 3) || [];

    return (
        <div className="flex-1 px-4 py-4 md:px-8 flex flex-col gap-y-6 overflow-y-auto">
            {/* Profile Card */}
            <Card className="border-2">
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex items-center gap-4 flex-1">
                            {session?.user.image ? (
                                <img
                                    src={session.user.image}
                                    alt={session.user.name || "User"}
                                    className="w-20 h-20 rounded-full"
                                />
                            ) : (
                                <GeneratedAvatar
                                    seed={session?.user.name || "U"}
                                    className="w-20 h-20"
                                    variant="initials"
                                />
                            )}
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold mb-1">
                                    Welcome back, {session?.user.name || "User"}!
                                </h1>
                                <p className="text-muted-foreground">
                                    {session?.user.email}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Link href="/meetings">
                                <Button className="gap-2">
                                    <CalendarIcon className="size-4" />
                                    Schedule Meeting
                                </Button>
                            </Link>
                            <Link href="/agents">
                                <Button variant="outline" className="gap-2">
                                    <BotIcon className="size-4" />
                                    Create Agent
                                </Button>
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Meetings
                        </CardTitle>
                        <VideoIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalMeetings}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            All time meetings scheduled
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            AI Agents
                        </CardTitle>
                        <BotIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalAgents}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Active AI assistants
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Completed
                        </CardTitle>
                        <CalendarCheckIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {completedMeetings}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Successfully finished meetings
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Duration
                        </CardTitle>
                        <ClockIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatDuration(totalDuration)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Time spent in meetings
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity & Upcoming Meetings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Recent Meetings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUpIcon className="size-5" />
                            Recent Meetings
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentMeetings.length > 0 ? (
                            <div className="space-y-4">
                                {recentMeetings.map((meeting) => (
                                    <Link
                                        key={meeting.id}
                                        href={`/meetings/${meeting.id}`}
                                        className="block"
                                    >
                                        <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors">
                                            <GeneratedAvatar
                                                seed={meeting.agent.name}
                                                variant="botttsNeutral"
                                                className="size-10"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">
                                                    {meeting.name}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    with {meeting.agent.name}
                                                </p>
                                            </div>
                                            <Badge
                                                variant={
                                                    meeting.status === "completed"
                                                        ? "default"
                                                        : meeting.status === "active"
                                                        ? "destructive"
                                                        : "secondary"
                                                }
                                                className="capitalize"
                                            >
                                                {meeting.status}
                                            </Badge>
                                        </div>
                                    </Link>
                                ))}
                                <Link href="/meetings">
                                    <Button
                                        variant="ghost"
                                        className="w-full gap-2"
                                    >
                                        View all meetings
                                        <ArrowRightIcon className="size-4" />
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <VideoIcon className="size-12 mx-auto text-muted-foreground mb-3" />
                                <p className="text-muted-foreground">
                                    No meetings yet
                                </p>
                                <Link href="/meetings">
                                    <Button className="mt-4 gap-2">
                                        <CalendarIcon className="size-4" />
                                        Schedule your first meeting
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <SparklesIcon className="size-5" />
                            Quick Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-lg border">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <CalendarIcon className="size-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Upcoming</p>
                                        <p className="text-sm text-muted-foreground">
                                            Scheduled meetings
                                        </p>
                                    </div>
                                </div>
                                <span className="text-2xl font-bold">
                                    {upcomingMeetings}
                                </span>
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-lg border">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <BotIcon className="size-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium">AI Agents</p>
                                        <p className="text-sm text-muted-foreground">
                                            Ready to assist
                                        </p>
                                    </div>
                                </div>
                                <span className="text-2xl font-bold">
                                    {totalAgents}
                                </span>
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-lg border">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <CalendarCheckIcon className="size-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Completed</p>
                                        <p className="text-sm text-muted-foreground">
                                            Finished meetings
                                        </p>
                                    </div>
                                </div>
                                <span className="text-2xl font-bold">
                                    {completedMeetings}
                                </span>
                            </div>

                            <Link href="/agents">
                                <Button variant="ghost" className="w-full gap-2">
                                    View all agents
                                    <ArrowRightIcon className="size-4" />
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
