"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SendIcon, SparklesIcon } from "lucide-react";
import Markdown from "react-markdown";

interface Message {
    role: "user" | "assistant";
    content: string;
}

interface Props {
    meetingId: string;
}

export const ChatTab = ({ meetingId }: Props) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { role: "user" as const, content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    meetingId,
                    messages: [...messages, userMessage],
                }),
            });

            if (!response.ok) throw new Error("Failed to send message");

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let assistantMessage = "";

            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "" },
            ]);

            while (reader) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                assistantMessage += chunk;

                setMessages((prev) => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].content =
                        assistantMessage;
                    return newMessages;
                });
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[600px]">
            <ScrollArea className="flex-1 px-4 py-5" ref={scrollRef}>
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground space-y-3">
                        <SparklesIcon className="size-12" />
                        <p className="text-sm">
                            Ask me anything about this meeting
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${
                                    message.role === "user"
                                        ? "justify-end"
                                        : "justify-start"
                                }`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                                        message.role === "user"
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted prose prose-sm max-w-none"
                                    }`}
                                >
                                    {message.role === "assistant" ? (
                                        <Markdown>{message.content}</Markdown>
                                    ) : (
                                        <p className="text-sm">
                                            {message.content}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </ScrollArea>
            <form
                onSubmit={handleSubmit}
                className="border-t px-4 py-3 flex gap-2"
            >
                <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about this meeting..."
                    className="min-h-[60px] resize-none"
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                        }
                    }}
                />
                <Button
                    type="submit"
                    size="icon"
                    disabled={!input.trim() || isLoading}
                >
                    <SendIcon />
                </Button>
            </form>
        </div>
    );
};
