import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { serve } from "@upstash/workflow/nextjs"
import { eq } from "drizzle-orm";
import WelcomeEmail from "@/email/WelcomeEmail";
import WeMissYou from "@/email/WeMissYou";
import MilestoneEmail from "@/email/MilestoneEmail";
import { resend } from "@/lib/email";

type UserState = "non-active" | "active";

type InitialData = {
    email: string;
    fullName: string;
}

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
const THREE_DAY_IN_MS = 3 * ONE_DAY_IN_MS;
const THIRTY_DAY_IN_MS = 30 * ONE_DAY_IN_MS;

const getUserState = async (email: string): Promise<UserState> => {
    const user = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

    if (user.length === 0) return "non-active";

    const lastActivityDate = new Date(user[0].lastActivityDate!);
    const now = new Date();
    const timeDifference = now.getTime() - lastActivityDate.getTime();

    if (timeDifference > THREE_DAY_IN_MS && timeDifference <= THIRTY_DAY_IN_MS) {
        return "non-active";
    }

    return "active";
}

export const { POST } = serve<InitialData>(async (context) => {
    const { email, fullName } = context.requestPayload

    await context.run("new-signup", async () => {
        await resend.emails.send({
            from: `BookWise <contact@devamit.info>`,
            to: [email],
            subject: "Start reading smarter with BookWise!",
            react: WelcomeEmail({ fullName: fullName })
        })
    })

    await context.sleep("wait-for-3-days", 60 * 60 * 24 * 3)

    while (true) {
        const state = await context.run("check-user-state", async () => {
            return await getUserState(email);
        })

        if (state === "non-active") {
            await context.run("send-email-non-active", async () => {
                await resend.emails.send({
                    from: `BookWise <contact@devamit.info>`,
                    to: [email],
                    subject: `Your bookshelf misses you, ${fullName.split(" ")[0]}`,
                    react: WeMissYou({ fullName: fullName })
                })
            })
        } else if (state === "active") {
            await context.run("send-email-active", async () => {
                await resend.emails.send({
                    from: `BookWise <contact@devamit.info>`,
                    to: [email],
                    subject: `Great to see you again, ${fullName.split(" ")[0]}!`,
                    react: MilestoneEmail({ fullName: fullName })
                })
            })
        }

        await context.sleep("wait-for-1-month", 60 * 60 * 24 * 30)
    }
})