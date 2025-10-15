"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "./ui/drawer";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";

interface ResponsiveDialogProps {
    title: string;
    description: string;
    onOpenChange: (open: boolean) => void;
    open: boolean;
    children: React.ReactNode;
}

export const ResponsiveDialog = ({
    title,
    description,
    onOpenChange,
    open,
    children,
}: ResponsiveDialogProps) => {
    const isMobile = useIsMobile();
    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={onOpenChange}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>{title}</DrawerTitle>
                        <DrawerDescription>{description}</DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4">{children}</div>
                </DrawerContent>
            </Drawer>
        );
    }
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    );
};
