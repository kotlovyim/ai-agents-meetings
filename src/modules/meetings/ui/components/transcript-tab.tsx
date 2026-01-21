"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { formatDuration } from "@/lib/utils";

interface TranscriptItem {
    speaker_id: string;
    type: string;
    text: string;
    start_ts: number;
    stop_ts: number;
    speaker: {
        id: string;
        name: string;
    };
}

interface Props {
    transcript: string | null;
}

export const TranscriptTab = ({ transcript }: Props) => {
    if (!transcript) {
        return (
            <div className="px-4 py-5 text-center text-muted-foreground">
                No transcript available
            </div>
        );
    }

    let items: TranscriptItem[] = [];
    try {
        items = JSON.parse(transcript);
    } catch {
        return (
            <div className="px-4 py-5 text-center text-muted-foreground">
                Invalid transcript data
            </div>
        );
    }

    return (
        <ScrollArea className="h-[600px]">
            <div className="px-4 py-5 space-y-4">
                {items.map((item, index) => (
                    <div key={index} className="flex gap-3">
                        <GeneratedAvatar
                            variant="botttsNeutral"
                            seed={item.speaker?.name || "Unknown"}
                            className="size-8 mt-1"
                        />
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-sm capitalize">
                                    {item.speaker?.name || "Unknown"}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {formatDuration(item.start_ts)}
                                </span>
                            </div>
                            <p className="text-sm leading-relaxed">
                                {item.text}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </ScrollArea>
    );
};
