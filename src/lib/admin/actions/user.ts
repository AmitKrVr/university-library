"use server"

import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function approvedUser(userId: string) {

    try {
        const updatedUsers = await db.update(users).set({ status: "APPROVED" }).where(eq(users.id, userId)).returning();

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