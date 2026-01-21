import { createAvatar } from "@dicebear/core";
import { botttsNeutral, initials } from "@dicebear/collection";

interface Props {
    seed?: string;
    variant?: "botttsNeutral" | "initials";
}

export const generateAvatarUri = ({ seed, variant = "initials" }: Props) => {
    let avatar;
    switch (variant) {
        case "initials":
            avatar = createAvatar(initials, {
                seed,
                fontWeight: 500,
                fontSize: 42,
            });
            break;
        case "botttsNeutral":
        default:
            avatar = createAvatar(botttsNeutral, { seed });
            break;
    }
    return avatar.toDataUri();
};
