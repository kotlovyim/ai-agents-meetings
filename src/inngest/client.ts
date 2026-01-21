import { Inngest } from "inngest";

export const inngest = new Inngest({
    id: "zvjazok",
    eventKey: process.env.INNGEST_EVENT_KEY,
});
