"use server"

import { db } from "@/database/drizzle"
import { books } from "@/database/schema"
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
        console.error(error)

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
        return { success: true };
    } catch (err) {
        console.error("Delete failed:", err);
        return { success: false, error: "Failed to delete book." };
    }
}
