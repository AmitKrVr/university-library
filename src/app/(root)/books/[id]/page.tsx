"use client"

import BookCover from "@/components/BookCover";
import BookOverview from "@/components/BookOverview";
import BookVideo from "@/components/BookVideo";
import { useBook, useBooks } from "@/hooks/useBook";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";

const BookDetailsPage = () => {
    const { id } = useParams<{ id: string }>()

    const { data: book,
        isPending: isBookDetailsPending,
        isError: isBookDetailsError,
        error: bookDetailsError } = useBook(id);

    const { data: allBooks, isPending, isError, error } = useBooks(1, 12, false)

    if (isBookDetailsPending) {
        return (
            <div className="w-full h-[50vh] flex items-center justify-center">
                <Loader2 className="size-10 text-primary animate-spin" />
            </div>
        )
    }

    if (isError) {
        toast.error("Error", {
            description: error.message,
        })
    }

    if (isBookDetailsError) {
        toast.error("Error", {
            description: bookDetailsError.message,
        })
    }

    return (
        <>
            <BookOverview {...book} />

            <div className="book-details">
                <div className="flex-[1.5]">
                    <section className="flex flex-col gap-7">
                        <h3>Video</h3>

                        <BookVideo videoUrl={book.videoUrl} />
                    </section>

                    <section className="mt-10 flex flex-col gap-7">
                        <h3>Summary</h3>

                        <div className="space-y-5 text-xl text-light-100">
                            {book.summary?.split("\n").map((line: string, i: number) => (
                                <p key={i}>
                                    {line}
                                </p>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="flex-1">
                    <section className="flex flex-col gap-7">
                        <h3>More similar books</h3>

                        <div className="flex flex-wrap gap-7">
                            {allBooks?.slice(1, 7).map((book: Book) => (
                                <Link key={book.id} href={`/books/${book.id}`}>
                                    <BookCover
                                        coverColor={book.coverColor}
                                        coverImage={book.coverUrl}
                                        variant="medium"
                                    />
                                </Link>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </>
    )
}
export default BookDetailsPage