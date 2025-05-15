"use server";

import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";

type Role = "ADMIN" | "USER";

export async function changeUserRoleAction(userId: string, newRole: Role) {
    try {
        const updatedUsers = await db.update(users).set({ role: newRole }).where(eq(users.id, userId)).returning();

        if (updatedUsers.length === 0) {
            throw new Error("User not found or no change made");
        }

        return {
            success: true,
            message: "User role has been successfully updated.",
            user: updatedUsers[0] ?? null
        }

    } catch (error) {
        return {
            success: false,
            message: "Failed to update user role in database"
        }
    }
}