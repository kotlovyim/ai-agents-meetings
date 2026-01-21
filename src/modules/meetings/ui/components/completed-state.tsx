import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MeetingGetOne } from "../../types";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
    BookOpenTextIcon,
    ClockFadingIcon,
    FileTextIcon,
    FileVideoIcon,
    SparklesIcon,
} from "lucide-react";
import { TabsContent } from "@radix-ui/react-tabs";
import Link from "next/link";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { formatDuration } from "@/lib/utils";
import Markdown from "react-markdown";
import { TranscriptTab } from "./transcript-tab";
import { ChatTab } from "./chat-tab";

interface Props {
    data: MeetingGetOne;
}

export const CompletedState = ({ data }: Props) => {
    return (
        <div className="flex flex-col gap-y-4">
            <Tabs defaultValue="summary" className="w-full">
                <div className="bg-white rounded-lg border px-3">
                    <ScrollArea>
                        <TabsList className="p-0 bg-background justify-start rounded-none h-13">
                            <TabsTrigger
                                value="summary"
                                className="text-muted-foreground rounded-none bg-background data-[state-active]:shadow-none:border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground"
                            >
                                <BookOpenTextIcon /> Summary
                            </TabsTrigger>
                            <TabsTrigger
                                value="transcript"
                                className="text-muted-foreground rounded-none bg-background data-[state-active]:shadow-none:border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground"
                            >
                                <FileTextIcon /> Transcript
                            </TabsTrigger>
                            <TabsTrigger
                                value="recording"
                                className="text-muted-foreground rounded-none bg-background data-[state-active]:shadow-none:border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground"
                            >
                                <FileVideoIcon /> Recording
                            </TabsTrigger>
                            <TabsTrigger
                                value="chat"
                                className="text-muted-foreground rounded-none bg-background data-[state-active]:shadow-none:border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground"
                            >
                                <SparklesIcon /> Ask AI
                            </TabsTrigger>
                        </TabsList>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </div>
                <TabsContent value="summary">
                    <div className="bg-white rounded-lg border">
                        <div className="px-4 py-5 gap-y-5 flex flex-col col-span-5">
                            <h2 className="text-2xl font-medium capitalize">
                                {data.name}
                            </h2>
                            <div className="flex gap-x-2 items-center">
                                <Link
                                    href={`/agents/${data.agent.id}`}
                                    className="flex items-center gap-x-2 underline underline-offset-4 capitalize"
                                >
                                    <GeneratedAvatar
                                        variant="botttsNeutral"
                                        seed={data.agent.name}
                                        className="size-5"
                                    />
                                    {data.agent.name}
                                </Link>
                                <p>
                                    {data.startedAt &&
                                        format(data.startedAt, "PPP")}
                                </p>
                            </div>
                            <div className="flex gap-x-2 items-center">
                                <Badge
                                    variant="outline"
                                    className="flex items-center gap-x-2 [&>svg]:size-4"
                                >
                                    <ClockFadingIcon className="text-blue-700" />
                                    {data.duration
                                        ? formatDuration(data.duration)
                                        : "No duration"}
                                </Badge>
                            </div>
                            <div className="flex flex-col gap-y-4">
                                <div className="flex gap-x-2 items-center">
                                    <SparklesIcon className="size-4" />
                                    <h3 className="text-lg font-semibold">
                                        General summary
                                    </h3>
                                </div>
                                <Markdown
                                    components={{
                                        h1: (props) => (
                                            <h1
                                                className="text-2xl font-bold mb-6"
                                                {...props}
                                            />
                                        ),
                                        h2: (props) => (
                                            <h2
                                                className="text-xl font-bold mb-6"
                                                {...props}
                                            />
                                        ),
                                        h3: (props) => (
                                            <h3
                                                className="text-lg font-bold mb-6"
                                                {...props}
                                            />
                                        ),
                                        h4: (props) => (
                                            <h4
                                                className="text-base font-bold mb-6"
                                                {...props}
                                            />
                                        ),
                                        p: (props) => (
                                            <p
                                                className="mb-6 leading-relaxed"
                                                {...props}
                                            />
                                        ),
                                        ul: (props) => (
                                            <ul
                                                className="list-disc list-inside mb-6"
                                                {...props}
                                            />
                                        ),
                                        ol: (props) => (
                                            <ol
                                                className="list-decimal list-inside mb-6"
                                                {...props}
                                            />
                                        ),
                                        li: (props) => (
                                            <li className="mb-1" {...props} />
                                        ),
                                        strong: (props) => (
                                            <strong
                                                className="font-semibold"
                                                {...props}
                                            />
                                        ),
                                        code: (props) => (
                                            <code
                                                className="bg-gray-100 px-1 py-0.5 rounded"
                                                {...props}
                                            ></code>
                                        ),
                                        blockquote: (props) => (
                                            <blockquote
                                                className="border-l-4 italic my-6"
                                                {...props}
                                            />
                                        ),
                                    }}
                                >
                                    {data.summary || ""}
                                </Markdown>
                            </div>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent
                    value="transcript"
                    className="bg-white rounded-lg border"
                >
                    <TranscriptTab transcript={data.transcript} />
                </TabsContent>
                <TabsContent
                    value="recording"
                    className="bg-white rounded-lg border px-4 py-5"
                >
                    <video
                        src={data.recordingUrl!}
                        controls
                        className="w-full h- rounded-md"
                    >
                        Your browser does not support the video tag.
                    </video>
                </TabsContent>
                <TabsContent
                    value="chat"
                    className="bg-white rounded-lg border"
                >
                    <ChatTab meetingId={data.id} />
                </TabsContent>
            </Tabs>
        </div>
    );
};
