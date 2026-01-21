"use client";

import { SparklesIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const UpgradeHeader = () => {
    return (
        <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
            <div className="flex items-center justify-between">
                <h5 className="font-medium text-xl">Upgrade Plan</h5>
                <Badge variant="secondary" className="text-xs px-2 py-1">
                    <SparklesIcon className="size-3 mr-1" />
                    Special Offer
                </Badge>
            </div>
        </div>
    );
};
