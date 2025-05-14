'use server'

import { auth } from "@/auth"
import { db } from "@/database/drizzle"
import { books, borrowRecords, users } from "@/database/schema"
import { eq, desc } from "drizzle-orm"

export const getUserProfile = async () => {
    const session = await auth()

    if (!session?.user?.id) {
        throw new Error("Unauthorized")
    }

    const borrowedWithBooks = await db
        .select({
            borrow: borrowRecords,
            book: books,
        })
        .from(borrowRecords)
        .innerJoin(books, eq(borrowRecords.bookId, books.id))
        .where(eq(borrowRecords.userId, session.user.id))
        .orderBy(desc(borrowRecords.createdAt))

    const [user] = await db
        .select({
            status: users.status,
            universityId: users.universityId,
            universityCard: users.universityCard,
        })
        .from(users)
        .where(eq(users.id, session.user.id))
        .limit(1)

    return {
        user: {
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            ...user,
        },
        borrowedWithBooks,
    }
}
