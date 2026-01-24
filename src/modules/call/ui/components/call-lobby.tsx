import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { generateAvatarUri } from "@/lib/avatar";
import {
    DefaultVideoPlaceholder,
    StreamVideoParticipant,
    ToggleAudioPreviewButton,
    ToggleVideoPreviewButton,
    useCallStateHooks,
    VideoPreview,
} from "@stream-io/video-react-sdk";
import { LogInIcon } from "lucide-react";
import Link from "next/link";

interface Props {
    onJoin: () => void;
}

const DisabledVideoPreview = () => {
    const { data } = authClient.useSession();

    return (
        <div className="flex items-center justify-center h-full">
            <DefaultVideoPlaceholder
                participant={
                    {
                        name: data?.user.name ?? "",
                        image:
                            data?.user.image ??
                            generateAvatarUri({ seed: data?.user.name ?? "" }),
                    } as StreamVideoParticipant
                }
            />
        </div>
    );
};

const AllowBrowserPermissions = () => {
    return (
        <p className="text-center text-sm text-muted-foreground">
            Please grant your browser a permission to access your camera and
            microphone.
        </p>
    );
};

export const CallLobby = ({ onJoin }: Props) => {
    const { useCameraState, useMicrophoneState } = useCallStateHooks();

    const { hasBrowserPermission: hasMicPermission } = useMicrophoneState();
    const { hasBrowserPermission: hasCamPermission } = useCameraState();

    const hasBrowserMediaPermissions = hasMicPermission && hasCamPermission;

    return (
        <div className="flex flex-col items-center justify-center h-full bg-radial from-siderbar from-sidebar-accent to-sidebar">
            <div className="py-4 px-4 md:px-8 flex flex-1 items-center justify-center w-full">
                <div className="flex flex-col items-center justify-center gap-y-4 sm:gap-y-6 bg-background rounded-lg p-4 sm:p-6 md:p-10 shadow-sm max-w-full md:max-w-2xl w-full">
                    <div className="flex flex-col gap-y-2 text-center">
                        <h6 className="text-base sm:text-lg font-medium">Ready to join?</h6>
                        <p className="text-xs sm:text-sm">Set up call before joining.</p>
                    </div>
                    <div className="w-full overflow-hidden rounded-lg">
                        <VideoPreview
                            DisabledVideoPreview={
                                hasBrowserMediaPermissions
                                    ? DisabledVideoPreview
                                    : AllowBrowserPermissions
                            }
                        />
                    </div>
                    <div className="flex gap-x-2">
                        <ToggleAudioPreviewButton />
                        <ToggleVideoPreviewButton />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-x-2 justify-between w-full">
                        <Button asChild variant="ghost" className="w-full sm:w-auto">
                            <Link href="/meetings">Cancel</Link>
                        </Button>
                        <Button
                            onClick={onJoin}
                            disabled={!hasBrowserMediaPermissions}
                            className="w-full sm:w-auto"
                        >
                            <LogInIcon />
                            Join Call
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
