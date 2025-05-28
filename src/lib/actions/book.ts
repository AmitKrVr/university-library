"use server"

import { db } from "@/database/drizzle";
import { books, borrowRecords } from "@/database/schema";
import { desc, eq, sql } from "drizzle-orm";
import dayjs from "dayjs"
import redis from "@/database/redis";
import { getUserById } from "../getUserById";
import { resend } from "../email";
import BookBorrowConfirmation from "@/email/BookBorrowConfirmation";
import { workflowClient } from "../workflow";
import config from "../config";
import { borrowCountKey } from "../cacheKeys";

type GetBooksResponse =
    | { success: true; data: Book[] }
    | { success: false; message: string };


export const borrowBook = async (params: BorrowBookParams) => {
    const { userId, bookId } = params;

    try {
        const user = await getUserById(userId);

        if (user?.status !== "APPROVED") {
            return {
                success: false,
                message: "You are not eligible to borrow this book"
            }
        }

        const book = await db
            .select({
                bookTitle: books.title,
                availableCopies: books.availableCopies
            })
            .from(books)
            .where(eq(books.id, bookId))
            .limit(1);

        if (!book.length || book[0].availableCopies <= 0) {
            return {
                success: false,
                message: "Book is not available for borrowing",
            }
        };

        const dueDate = dayjs().add(7, 'day').toISOString();

        const [record] = await db
            .insert(borrowRecords)
            .values({ userId, bookId, dueDate, status: "BORROWED" })
            .returning();

        await db
            .update(books)
            .set({ availableCopies: book[0].availableCopies - 1 })
            .where(eq(books.id, bookId));

        await redis.del(`book-details:${bookId}`)
        await redis.del("all_books_first_page")
        await redis.del(borrowCountKey)

        if (user.email) {
            await resend.emails.send({
                from: `BookWise <contact@devamit.info>`,
                to: [user.email],
                subject: `You have borrowed "${book[0].bookTitle}"`,
                react: BookBorrowConfirmation({
                    fullName: user.name,
                    bookTitle: book[0].bookTitle,
                    dueDate: record.dueDate,
                    borrowDate: record.borrowDate
                })
            })
        }

        await workflowClient.trigger({
            url: `${config.env.prodApiEndpoint}/api/due-reminder`,
            body: {
                email: user.email,
                fullName: user.name,
                bookTitle: book[0].bookTitle,
                dueDate: record.dueDate,
            },
        });

        return {
            success: true,
            data: JSON.parse(JSON.stringify(record))
        }

    } catch (error) {
        console.error(error)
        return {
            success: false,
            message: "An error occurred while borrowing the book"
        }
    }
}

export const getBooks = async (page = 1, limit = 12): Promise<GetBooksResponse> => {
    try {
        const offset = (page - 1) * limit;

        if (page === 1) {
            const cacheKey = "all_books_first_page";
            const cached = await redis.get(cacheKey);
            if (cached) {
                return {
                    success: true,
                    data: cached as Book[],
                };
            }

            const data = await db
                .select()
                .from(books)
                .limit(limit)
                .orderBy(desc(books.createdAt))
                .offset(offset);

            await redis.set(cacheKey, data, { ex: 86400 }); // Cache for 1 day

            return {
                success: true,
                data: data,
            };
        }

        const data = await db
            .select()
            .from(books)
            .limit(limit)
            .offset(offset);

        return {
            success: true,
            data: data,
        };

    } catch (error) {
        console.error("Error fetching books:", error)
        return {
            success: false,
            message: "Failed to fetch books",
        };
    }
};

export const getBooksCount = async () => {
    try {
        const cacheKey = "total_books_count";

        const cached = await redis.get<number>(cacheKey);
        if (cached !== null) {
            return {
                success: true,
                data: cached,
            }
        }

        const result = await db.select({ count: sql<number>`count(*)` }).from(books);
        const count = result[0]?.count ?? 0;
        await redis.set(cacheKey, count, { ex: 86400 });

        return {
            success: true,
            data: count,
        }
    } catch (error) {
        console.error(error)
        return {
            success: false,
            message: "Failed to fetch book count",
        }
    }
};

export const getBookDetails = async (id: string): Promise<GetBooksResponse> => {
    try {
        const cacheKey = `book-details:${id}`;

        const cached = await redis.get(cacheKey);
        if (cached !== null) {
            return {
                success: true,
                data: cached as Book[],
            }
        }

        const bookDetails = await db.select().from(books).where(eq(books.id, id)).limit(1);
        await redis.set(cacheKey, bookDetails, { ex: 3600 });
        return {
            success: true,
            data: bookDetails,
        }
    } catch (error) {
        console.error("Error fetching book details:", error);
        return {
            success: false,
            message: "Failed to fetch book details",
        }
    }
}