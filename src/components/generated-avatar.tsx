import { createAvatar } from "@dicebear/core";
import { botttsNeutral, initials } from "@dicebear/collection";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface GeneratedAvatarProps {
    seed: string;
    className?: string;
    variant?: "botttsNeutral" | "initials";
}

export const GeneratedAvatar = ({
    seed,
    className,
    variant = "botttsNeutral",
}: GeneratedAvatarProps) => {
    let avatar;

    if (variant === "botttsNeutral") {
        avatar = createAvatar(botttsNeutral, {
            seed: seed,
        });
    } else {
        avatar = createAvatar(initials, {
            seed: seed,
            fontWeight: 500,
            fontSize: 60,
        });
    }

    return (
        <Avatar className={cn(className)}>
            <AvatarImage src={avatar.toDataUri()} alt="Generated Avatar" />
            <AvatarFallback>{seed.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
    );
};
