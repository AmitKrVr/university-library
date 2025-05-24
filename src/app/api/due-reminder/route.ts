import { serve } from "@upstash/workflow/nextjs";
import { resend } from "@/lib/email";
import BookDueReminder from "@/email/BookDueReminder";

type DueReminderInput = {
    email: string;
    fullName: string;
    bookTitle: string;
    dueDate: string;
};

export const { POST } = serve<DueReminderInput>(async (context) => {
    const { email, fullName, bookTitle, dueDate } = context.requestPayload;

    const due = new Date(dueDate);
    const now = new Date();
    const msUntilReminder = due.getTime() - now.getTime() - 2 * 24 * 60 * 60 * 1000; // 2 days before due date

    const delay = Math.max(msUntilReminder, 0);

    await context.sleep("wait-until-reminder", delay / 1000);

    await context.run("send-due-reminder", async () => {
        await resend.emails.send({
            from: `BookWise <contact@devamit.info>`,
            to: [email],
            subject: `Reminder: ${bookTitle} is due soon!`,
            react: BookDueReminder({ fullName, bookTitle, dueDate }),
        });
    });
});
