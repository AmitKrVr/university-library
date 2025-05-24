"use server"

import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import AccountApproval from "@/email/AccountApproval";
import RejectAccountRequest from "@/email/RejectAccountRequest";
import { resend } from "@/lib/email";
import { eq } from "drizzle-orm";

export async function approvedUser(userId: string) {

    try {
        const updatedUsers = await db.update(users).set({ status: "APPROVED" }).where(eq(users.id, userId)).returning();

        if (updatedUsers[0].email) {
            await resend.emails.send({
                from: `BookWise <contact@devamit.info>`,
                to: [updatedUsers[0].email],
                subject: `Your BookWise Account Has Been Approved!`,
                react: AccountApproval({
                    fullName: updatedUsers[0].fullName,
                })
            })
        }

        return {
            success: true,
            message: "User account has been successfully approved.",
            user: updatedUsers[0] ?? null
        }
    } catch (error) {
        return {
            success: false,
            message: "Failed to approve account"
        }
    }
}

export async function rejectUser(userId: string) {

    try {
        const updatedUsers = await db.update(users).set({ status: "REJECTED" }).where(eq(users.id, userId)).returning();

        if (updatedUsers[0].email) {
            await resend.emails.send({
                from: `BookWise <contact@devamit.info>`,
                to: [updatedUsers[0].email],
                subject: `Your BookWise Account Has Been Approved!`,
                react: RejectAccountRequest({
                    fullName: updatedUsers[0].fullName,
                })
            })
        }

        return {
            success: true,
            message: "User account has been successfully rejected.",
            user: updatedUsers[0] ?? null
        }
    } catch (error) {
        return {
            success: false,
            message: "Failed to reject user account"
        }
    }
}