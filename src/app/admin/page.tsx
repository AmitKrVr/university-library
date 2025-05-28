import { db } from "@/database/drizzle"
import { books, borrowRecords, users } from "@/database/schema"
import { getTrend } from "@/lib/utils"
import { and, count, desc, eq, gte, lte } from "drizzle-orm"
import redis from "@/database/redis"
import { bookCountKey, borrowCountKey, userCountKey } from "@/lib/cacheKeys"
import dayjs from "dayjs"

import { DashboardStatCard } from "@/components/admin/dashboard/DashboardStatCard"
import BorrowRequestsSection from "@/components/admin/dashboard/BorrowRequestsSection"
import AccountRequestsSection from "@/components/admin/dashboard/AccountRequestsSection"
import RecentBooksSection from "@/components/admin/dashboard/RecentBooksSection"
import StatErrorDisplay from "@/components/admin/dashboard/StatErrorDisplay"

const todayStart = dayjs().startOf('day').toDate()
const yesterdayStart = dayjs().subtract(1, 'day').startOf('day').toDate()
const yesterdayEnd = dayjs().subtract(1, 'day').endOf('day').toDate()

async function safeExecute<T>(
    operation: () => Promise<T>,
    fallback: T,
    errorMessage?: string
): Promise<{ data: T; error: boolean; message?: string }> {
    try {
        const result = await operation()
        return { data: result, error: false }
    } catch (error) {
        console.error(errorMessage || 'Operation failed:', error)
        return {
            data: fallback,
            error: true,
            message: errorMessage || 'Failed to load data'
        }
    }
}

const AdminDashboard = async () => {
    const cacheResults = await Promise.allSettled([
        redis.get(borrowCountKey),
        redis.get(userCountKey),
        redis.get(bookCountKey),
    ])

    const cachedBorrowCount = cacheResults[0].status === 'fulfilled' ? cacheResults[0].value : null
    const cachedUserCount = cacheResults[1].status === 'fulfilled' ? cacheResults[1].value : null
    const cachedBookCount = cacheResults[2].status === 'fulfilled' ? cacheResults[2].value : null

    const [
        borrowCountResult,
        userCountResult,
        bookCountResult,
        borrowedTodayResult,
        borrowedYesterdayResult,
        usersTodayResult,
        usersYesterdayResult,
        booksTodayResult,
        booksYesterdayResult,
        recentBooksResult,
        borrowRequestResult,
        pendingUsersResult
    ] = await Promise.all([
        safeExecute(
            () => cachedBorrowCount
                ? Promise.resolve([{ count: Number(cachedBorrowCount) }])
                : db.select({ count: count() }).from(borrowRecords).where(eq(borrowRecords.status, "BORROWED")),
            [{ count: 0 }],
            "Failed to load borrowed books count"
        ),
        safeExecute(
            () => cachedUserCount
                ? Promise.resolve([{ count: Number(cachedUserCount) }])
                : db.select({ count: count() }).from(users),
            [{ count: 0 }],
            "Failed to load users count"
        ),
        safeExecute(
            () => cachedBookCount
                ? Promise.resolve([{ count: Number(cachedBookCount) }])
                : db.select({ count: count() }).from(books),
            [{ count: 0 }],
            "Failed to load books count"
        ),
        safeExecute(
            () => db.select({ count: count() }).from(borrowRecords).where(and(eq(borrowRecords.status, "BORROWED"), gte(borrowRecords.createdAt, todayStart))),
            [{ count: 0 }],
            "Failed to load today's borrowed books"
        ),
        safeExecute(
            () => db.select({ count: count() }).from(borrowRecords).where(and(eq(borrowRecords.status, "BORROWED"), gte(borrowRecords.createdAt, yesterdayStart), lte(borrowRecords.createdAt, yesterdayEnd))),
            [{ count: 0 }],
            "Failed to load yesterday's borrowed books"
        ),
        safeExecute(
            () => db.select({ count: count() }).from(users).where(gte(users.createdAt, todayStart)),
            [{ count: 0 }],
            "Failed to load today's users"
        ),
        safeExecute(
            () => db.select({ count: count() }).from(users).where(and(gte(users.createdAt, yesterdayStart), lte(users.createdAt, yesterdayEnd))),
            [{ count: 0 }],
            "Failed to load yesterday's users"
        ),

        safeExecute(
            () => db.select({ count: count() }).from(books).where(gte(books.createdAt, todayStart)),
            [{ count: 0 }],
            "Failed to load today's books"
        ),
        safeExecute(
            () => db.select({ count: count() }).from(books).where(and(gte(books.createdAt, yesterdayStart), lte(books.createdAt, yesterdayEnd))),
            [{ count: 0 }],
            "Failed to load yesterday's books"
        ),

        safeExecute(
            () => db.select({
                id: books.id,
                title: books.title,
                author: books.author,
                genre: books.genre,
                coverImage: books.coverUrl,
                coverColor: books.coverColor,
                createdAt: books.createdAt,
            }).from(books).orderBy(desc(books.createdAt)).limit(6),
            [],
            "Failed to load recent books"
        ),

        safeExecute(
            () => db.select({
                bookId: borrowRecords.bookId,
                borrowDate: borrowRecords.borrowDate,
                name: users.fullName,
                email: users.email,
                title: books.title,
                author: books.author,
                genre: books.genre,
                coverUrl: books.coverUrl,
                coverColor: books.coverColor,
            }).from(borrowRecords)
                .leftJoin(users, eq(users.id, borrowRecords.userId))
                .leftJoin(books, eq(books.id, borrowRecords.bookId))
                .orderBy(desc(borrowRecords.createdAt))
                .limit(3),
            [],
            "Failed to load borrow requests"
        ),

        safeExecute(
            () => db.select({
                id: users.id,
                name: users.fullName,
                email: users.email,
            }).from(users).where(eq(users.status, "PENDING")).limit(6),
            [],
            "Failed to load pending users"
        ),
    ]);


    if (!borrowCountResult.error && !cachedBorrowCount) {
        await safeExecute(
            () => redis.set(borrowCountKey, borrowCountResult.data[0].count.toString(), { ex: 300 }),
            null,
            "Failed to cache borrow count"
        )
    }
    if (!userCountResult.error && !cachedUserCount) {
        await safeExecute(
            () => redis.set(userCountKey, userCountResult.data[0].count.toString(), { ex: 300 }),
            null,
            "Failed to cache user count"
        )
    }
    if (!bookCountResult.error && !cachedBookCount) {
        await safeExecute(
            () => redis.set(bookCountKey, bookCountResult.data[0].count.toString(), { ex: 300 }),
            null,
            "Failed to cache book count"
        )
    }

    const borrowedToday = borrowedTodayResult.data[0].count
    const borrowedYesterday = borrowedYesterdayResult.data[0].count
    const { value: borrowedTrendValue, direction: borrowedTrend } = getTrend(borrowedToday, borrowedYesterday)

    const usersToday = usersTodayResult.data[0].count
    const usersYesterday = usersYesterdayResult.data[0].count
    const { value: usersTrendValue, direction: usersTrend } = getTrend(usersToday, usersYesterday)

    const booksToday = booksTodayResult.data[0].count
    const booksYesterday = booksYesterdayResult.data[0].count
    const { value: booksTrendValue, direction: booksTrend } = getTrend(booksToday, booksYesterday)

    return (
        <div className="flex flex-col gap-5">
            <div className="flex gap-5 justify-between">
                {borrowCountResult.error
                    ? (
                        <StatErrorDisplay title="Borrowed Books" message={borrowCountResult.message!} />
                    ) : (
                        <DashboardStatCard
                            title="Borrowed Books"
                            count={borrowCountResult.data[0].count}
                            trend={borrowedTrend}
                            trendValue={Math.abs(borrowedTrendValue)}
                        />
                    )}

                {userCountResult.error
                    ? (
                        <StatErrorDisplay title="Total Users" message={userCountResult.message!} />
                    ) : (
                        <DashboardStatCard
                            title="Total Users"
                            count={userCountResult.data[0].count}
                            trend={usersTrend}
                            trendValue={Math.abs(usersTrendValue)}
                        />
                    )}

                {bookCountResult.error
                    ? (
                        <StatErrorDisplay title="Total Books" message={bookCountResult.message!} />
                    ) : (
                        <DashboardStatCard
                            title="Total Books"
                            count={bookCountResult.data[0].count}
                            trend={booksTrend}
                            trendValue={Math.abs(booksTrendValue)}
                        />
                    )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="space-y-5">
                    <BorrowRequestsSection borrowRequests={borrowRequestResult} />
                    <AccountRequestsSection pendingUsersResult={pendingUsersResult} />
                </div>

                <RecentBooksSection recentBooksResult={recentBooksResult} />
            </div>
        </div>
    )
}
export default AdminDashboard;
