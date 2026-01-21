import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { meetingsProcessing } from "./functions";

export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [meetingsProcessing],
    signingKey: process.env.INNGEST_SIGNING_KEY,
});
