'use server'

import { db } from "@/database/drizzle"
import { books } from "@/database/schema"
import { ilike, or, sql } from "drizzle-orm"

export async function getInitialBooks(page = 1, limit = 12) {
    const offset = (page - 1) * limit
    return await db.select().from(books).limit(limit).offset(offset)
}

export async function countTotalBooks(query?: string) {
    const whereClause = or(
        ilike(books.title, `%${query}%`),
        ilike(books.author, `%${query}%`),
        ilike(books.genre, `%${query}%`),
    )

    const result = await db.select({ count: sql<number>`count(*)` }).from(books).where(whereClause);
    const count = result[0]?.count ?? 0;
    return count;

}

export async function searchBooks(query: string, page = 1, limit = 12) {
    if (!query || query.length < 2) return []

    const offset = (page - 1) * limit;

    const whereClause = or(
        ilike(books.title, `%${query}%`),
        ilike(books.author, `%${query}%`),
        ilike(books.genre, `%${query}%`),
    )

    const result = await db.select().from(books).where(whereClause).limit(limit).offset(offset);
    return result;
}


export async function fetchUniqueAuthors() {
    const result = await db.selectDistinct({ author: books.author }).from(books)
    return result.map((r) => r.author).filter(Boolean)
}

export async function fetchUniqueGenres() {
    const result = await db.selectDistinct({ genre: books.genre }).from(books)
    return result.map((r) => r.genre).filter(Boolean)
}