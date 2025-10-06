"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
    const {data : session} = authClient.useSession();

    if (!session) {
        return (
            <p>Loading...</p>
        );
    }

    return (
        <div>
           <h1>Welcome, {session.user?.name}</h1>
           <Button onClick={() => authClient.signOut({fetchOptions: {onSuccess: () => router.push("/sign-in")}})}>Sign Out</Button>
        </div>
    );
}
