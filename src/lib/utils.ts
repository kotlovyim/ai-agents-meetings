import { clsx, type ClassValue } from "clsx";
import humanizeDuration from "humanize-duration";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDuration(seconds: number): string {
    return humanizeDuration(seconds * 1000, {
        largest: 2,
        round: true,
        units: ["h", "m", "s"],
    });
}
