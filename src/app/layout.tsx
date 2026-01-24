import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { TRPCReactProvider } from "@/trpc/client";
import { NuqsAdapter } from "nuqs/adapters/next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Zvjazok - AI-Powered Video Meetings",
    description: "Next-generation video conferencing platform with intelligent AI agents. Create custom AI agents, host interactive meetings, and get real-time transcription and summaries.",
    icons: {
        icon: "/logo.svg",
        apple: "/logo.svg",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <NuqsAdapter>
            <TRPCReactProvider>
                <html lang="en">
                    <body className={`${inter.className} antialiased`}>
                        <Toaster />
                        {children}
                    </body>
                </html>
            </TRPCReactProvider>
        </NuqsAdapter>
    );
}
