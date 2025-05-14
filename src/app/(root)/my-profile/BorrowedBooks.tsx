"use client"

import BookCover from "@/components/BookCover"
import { Card, CardContent } from "@/components/ui/card"
import { getBorrowStatus, getMonthAndDay } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import ProfilePagination from "./ProfilePagination"

interface Props {
    borrowedWithBooks: Array<{
        borrow: {
            id: string;
            userId: string;
            bookId: string;
            borrowDate: Date;
            dueDate: string;
            returnDate: string | null;
            status: "BORROWED" | "RETURNED";
            createdAt: Date | null;
        };
        book: Book
    }>;
}

const BorrowedBooks = ({ borrowedWithBooks }: Props) => {

    const itemsPerPage = 4
    const [currentPage, setCurrentPage] = useState(1)

    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedBooks = borrowedWithBooks.slice(startIndex, endIndex)
    return (
        <>
            <h2 className="text-2xl font-semibold text-light-100">Borrowed Books</h2>
            {borrowedWithBooks.length > 1 ? (
                <div className="mt-20 text-center text-xl font-semibold text-light-100">
                    <p>You have not borrowed any books yet.</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                        {paginatedBooks?.slice(0, 4).map(({ borrow, book }, idx) => {
                            const status = getBorrowStatus(borrow.dueDate);

                            return (
                                <Card key={idx} className="gradient-vertical relative">
                                    {status.isOverdue && (
                                        <Image
                                            title="Overdue – please return this book"
                                            alt="Overdue warning"
                                            src="/icons/warning.svg"
                                            height={30}
                                            width={30}
                                            className="absolute top-0 left-0"
                                        />
                                    )}

                                    <CardContent className="space-y-4">
                                        <Link href={`/books/${book.id}`} key={idx}>
                                            <div
                                                className="flex items-center justify-center px-10 py-5 rounded-xl"
                                                style={{ backgroundColor: `${book.coverColor}30` }}
                                            >
                                                <BookCover coverColor={book.coverColor} coverImage={book.coverUrl} variant="medium" />
                                            </div>
                                        </Link>
                                        <div className="space-y-1.5 mt-4">
                                            <h3 className="line-clamp-2 text-xl font-semibold text-white ">{book.title}</h3>
                                            <p className="text-light-100 line-clamp-1 italic">{book.genre}</p>
                                        </div>
                                        <div className="flex">
                                            <div className="space-y-1.5 w-full">
                                                <p className="flex items-center gap-2 truncate text-light-100">
                                                    <Image
                                                        alt="book"
                                                        src="/icons/book-2.svg"
                                                        height={15}
                                                        width={15}

                                                    />
                                                    Borrowed on {getMonthAndDay(borrow.borrowDate)}
                                                </p>

                                                {borrow.returnDate
                                                    ? (
                                                        <p className="flex items-center gap-2 truncate text-light-100">
                                                            <Image
                                                                alt="book"
                                                                src="/icons/tick.svg"
                                                                height={15}
                                                                width={15}

                                                            />
                                                            Returned on 5th Jan
                                                        </p>
                                                    ) : (
                                                        <p className={`flex items-center gap-2 truncate ${status.isOverdue ? "text-red-400" : "text-light-100"}`}>
                                                            <Image
                                                                alt="book"
                                                                src={`/icons/${status.isOverdue ? "warning" : "calendar"}.svg`}
                                                                height={15}
                                                                width={15}

                                                            />
                                                            {status.message}
                                                        </p>
                                                    )}

                                            </div>
                                            <div className="flex items-end min-w-8">
                                                <Image
                                                    alt="receipt"
                                                    src="/icons/receipt.svg"
                                                    height={20}
                                                    width={20}
                                                    className="h-8 w-8 p-2 rounded-md cursor-pointer"
                                                    style={{ backgroundColor: `${book.coverColor}80` }}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>

                    {Math.ceil(borrowedWithBooks.length / itemsPerPage) > 1 &&
                        <ProfilePagination
                            currentPage={currentPage}
                            totalItems={borrowedWithBooks.length}
                            itemsPerPage={itemsPerPage}
                            setPage={setCurrentPage}
                        />
                    }
                </>
            )}
        </>
    )
}
export default BorrowedBooks