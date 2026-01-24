import { Button } from "@/components/ui/button";
import Link from "next/link";

export const CallEnded = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full bg-radial from-sidebar to-sidebar">
            <div className="py-4 px-4 md:px-8 flex flex-1 items-center justify-center w-full">
                <div className="flex flex-col items-center justify-center gap-y-4 sm:gap-y-6 bg-background rounded-lg p-6 sm:p-8 md:p-10 shadow-sm max-w-full md:max-w-2xl w-full mx-4">
                    <div className="flex flex-col gap-y-2 text-center">
                        <h6 className="text-base sm:text-lg font-medium">
                            You have ended the call
                        </h6>
                        <p className="text-xs sm:text-sm">
                            Summary will appear in a few minutes.
                        </p>
                    </div>
                    <div className="flex gap-x-2 justify-center items-center w-full">
                        <Button asChild variant="ghost" className="w-full sm:w-auto">
                            <Link href="/meetings">Back to Meetings</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
