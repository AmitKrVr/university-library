// lib/getUserById.ts
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { cache } from "react";

export const getUserById = cache(async (userId: string) => {
    const [user] = await db.select({
        id: users.id,
        status: users.status,
        role: users.role,
    }).from(users).where(eq(users.id, userId)).limit(1);

    return user || null;
});
