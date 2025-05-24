"use server"

import { db } from "@/database/drizzle"
import { books, borrowRecords } from "@/database/schema"
import BookReturnConfirmation from "@/email/BookReturnConfirmation";
import { resend } from "@/lib/email";
import { getUserById } from "@/lib/getUserById";
import { eq } from "drizzle-orm";

export const createBook = async (params: BookParams) => {
    try {
        const newBook = await db
            .insert(books)
            .values({
                ...params,
                availableCopies: params.totalCopies,
            }).returning();

        return {
            success: true,
            data: JSON.parse(JSON.stringify(newBook[0]))
        }
    } catch (error) {
        return {
            success: false,
            message: "An error occurred while creating the book"
        }
    }
}

export const updateBook = async (book: { id: string } & Partial<typeof books.$inferInsert>) => {
    try {
        const updated = await db
            .update(books)
            .set({
                title: book.title,
                author: book.author,
                genre: book.genre,
                rating: book.rating,
                totalCopies: book.totalCopies,
                coverUrl: book.coverUrl,
                coverColor: book.coverColor,
                description: book.description,
                videoUrl: book.videoUrl,
                summary: book.summary,
            })
            .where(eq(books.id, book.id))
            .returning();

        return { success: true, data: updated[0] };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
};

export async function deleteBook(bookId: string) {
    try {
        await db.delete(books).where(eq(books.id, bookId));
        return {
            success: true,
            message: "Book deleted successfully"
        };
    } catch (err) {
        return {
            success: false,
            message: "Failed to delete book."
        };
    }
}

export async function borrowStatus(id: string, newStatus: "BORROWED" | "RETURNED" | "LATERETURN") {
    try {
        const updateData =
            newStatus === "RETURNED" || "LATERETURN"
                ? { status: newStatus, newStatus, returnDate: new Date().toISOString() }
                : { newStatus };

        const [returnStatus] = await db
            .update(borrowRecords)
            .set(updateData)
            .where(eq(borrowRecords.id, id))
            .returning();

        const user = await getUserById(returnStatus.userId)
        const book = await db.select({ title: books.title }).from(books).where(eq(books.id, returnStatus.bookId))

        if (user.email) {
            await resend.emails.send({
                from: `BookWise <contact@devamit.info>`,
                to: [user.email],
                subject: `Thank You for Returning "${book[0].title}"`,
                react: BookReturnConfirmation({
                    fullName: user.name,
                    bookTitle: book[0].title,
                })
            })
        }

        return {
            success: true,
            message: `Book status successfully updated to "${newStatus}".`,
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to update book status. Please try again later.",
        };
    }
}