"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PanelLeftCloseIcon, PanelLeftIcon, SearchIcon } from "lucide-react";
import { DashboardCommand } from "./dashboard-command";
import { useSidebar } from "@/components/ui/sidebar";

export const DashboardNavbar = () => {
    const { state, toggleSidebar, isMobile } = useSidebar();
    const [commandOpen, setCommandOpen] = useState(false);
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setCommandOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => {
            document.removeEventListener("keydown", down);
        };
    }, []);

    return (
        <>
            <DashboardCommand open={commandOpen} setOpen={setCommandOpen} />
            <nav className="flex py-2 px-4 gap-x-2 items-center border-b bg-background">
                <Button
                    variant="outline"
                    className="size-9"
                    onClick={toggleSidebar}
                >
                    {state === "collapsed" || isMobile ? (
                        <PanelLeftIcon className="h-4 w-4" />
                    ) : (
                        <PanelLeftCloseIcon className="h-4 w-4" />
                    )}
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-9 w-[240px] justify-start font-normal text-muted-foreground hover:text-muted-foreground"
                    onClick={() => setCommandOpen((open) => !open)}
                >
                    <SearchIcon className="mr-2 h-4 w-4" />
                    Search
                    <kbd className="ml-auto pointer-events-none inline-flex select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                        <span className="text-xs">&#8984;</span>K
                    </kbd>
                </Button>
            </nav>
        </>
    );
};
