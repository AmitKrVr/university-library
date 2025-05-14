'use server'

import { db } from "@/database/drizzle";
import { users, borrowRecords } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function deleteUser(userId: string) {
    try {
        const userBorrows = await db.select({ count: borrowRecords.id })
            .from(borrowRecords)
            .where(eq(borrowRecords.userId, userId));

        if (userBorrows.length > 0) {
            throw new Error("Cannot delete user with active borrowed books");
        }

        await db.delete(users).where(eq(users.id, userId));

        return {
            success: true,
            message: "User deleted successfully"
        };
    } catch (error) {
        console.error("Error deleting user:", error);
        throw new Error(error instanceof Error ? error.message : "Failed to delete user");
    }
}