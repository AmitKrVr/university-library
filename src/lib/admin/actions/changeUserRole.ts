"use server";

import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";

// Combined server action file for all user role operations
type Role = "ADMIN" | "USER";

// Main server action that will be called from client components
export async function changeUserRoleAction(userId: string, role: Role) {
    if (!userId) {
        throw new Error("User ID is required");
    }

    try {
        const updatedUser = await _changeUserRoleInDb(userId, role);
        return { success: true, user: updatedUser };
    } catch (error) {
        console.error("Failed to change role:", error);
        throw error;
    }
}

// Internal function to handle database operations
// Using underscore prefix to indicate it's for internal use
async function _changeUserRoleInDb(userId: string, newRole: Role) {
    if (!userId || !newRole) throw new Error("Missing parameters");

    try {
        const result = await db
            .update(users)
            .set({ role: newRole })
            .where(eq(users.id, userId))
            .returning();

        if (result.length === 0) {
            throw new Error("User not found or no change made");
        }

        return result[0];
    } catch (error) {
        console.error(`Database error changing role for user ${userId}:`, error);
        throw new Error("Failed to update user role in database");
    }
}