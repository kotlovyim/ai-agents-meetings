import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { UpgradeView } from "@/modules/upgrade/ui/views/upgrade-view";

const UpgradePage = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }

    return <UpgradeView />;
};

export default UpgradePage;
