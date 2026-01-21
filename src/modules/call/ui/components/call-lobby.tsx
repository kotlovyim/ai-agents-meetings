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
            <div className="py-4 px-8 flex flex-1 items-center justify-center">
                <div className="flex flex-col items-center justify-center gap-y-6 bg-background rounded-lg p-10 shadow-sm">
                    <div className="flex flex-col gap-y-2 text-center">
                        <h6 className="text-lg font-medium">Ready to join?</h6>
                        <p className="text-sm">Set up call before joining.</p>
                    </div>
                    <VideoPreview
                        DisabledVideoPreview={
                            hasBrowserMediaPermissions
                                ? DisabledVideoPreview
                                : AllowBrowserPermissions
                        }
                    />
                    <div className="flex gap-x-2">
                        <ToggleAudioPreviewButton />
                        <ToggleVideoPreviewButton />
                    </div>
                    <div className="flex gap-x-2 justify-between w-full">
                        <Button asChild variant="ghost">
                            <Link href="/meetings">Cancel</Link>
                        </Button>
                        <Button
                            onClick={onJoin}
                            disabled={!hasBrowserMediaPermissions}
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
