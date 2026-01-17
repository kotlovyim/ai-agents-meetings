"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Separator } from "@radix-ui/react-separator";
import { BotIcon, StarIcon, VideoIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DashboardUserButton } from "./dashboard-user-button";

const firstSection = [
    {
        icon: VideoIcon,
        title: "Meetings",
        href: "/meetings",
    },
    {
        icon: BotIcon,
        title: "Agents",
        href: "/agents",
    },
];

const secondSection = [
    {
        icon: StarIcon,
        title: "Upgrade",
        href: "/upgrade",
    },
];

export const DashboardSidebar = () => {
    const pathname = usePathname();
    return (
        <Sidebar>
            <SidebarHeader className="text-sidebar-accent-foreground">
                <Link href="/" className="flex items-center gap-2 px-2 pt-2">
                    <Image src="/logo.svg" alt="Logo" width={32} height={32} />
                    <p className="text-2xl font-semibold">Zvjazok</p>
                </Link>
            </SidebarHeader>
            <div className="px-4 py-2">
                <Separator className="opacity-100 text-[#5D6D68]" />
            </div>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {firstSection.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton
                                        asChild
                                        className={cn(
                                            "h-10 hover:bg-liner-to-r/oklch border border-transparent hover:border-[#5D6D68]/10 from-sidebar-accent from-5%  via-30% via-sidebar/50 ",
                                            pathname === item.href
                                                ? "bg-liner-to-r/oklch border-[#5D6D68]/10"
                                                : "bg-transparent"
                                        )}
                                        isActive={pathname === item.href}
                                    >
                                        <Link href={item.href}>
                                            <item.icon className="h-5 w-5" />
                                            <span className="text-sm font-medium tracking-tight">
                                                {item.title}
                                            </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <div className="px-4 py-2">
                    <Separator className="opacity-100 text-[#5D6D68]" />
                </div>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {secondSection.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton
                                        asChild
                                        className={cn(
                                            "h-10 hover:bg-liner-to-r/oklch border border-transparent hover:border-[#5D6D68]/10 from-sidebar-accent from-5%  via-30% via-sidebar/50 ",
                                            pathname === item.href
                                                ? "bg-liner-to-r/oklch border-[#5D6D68]/10"
                                                : "bg-transparent"
                                        )}
                                        isActive={pathname === item.href}
                                    >
                                        <Link href={item.href}>
                                            <item.icon className="h-5 w-5" />
                                            <span className="text-sm font-medium tracking-tight">
                                                {item.title}
                                            </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="text-white">
                <DashboardUserButton />
            </SidebarFooter>
        </Sidebar>
    );
};
