'use client';

import { useBooks } from "@/hooks/useBook";
import BookCard from "./BookCard";

interface Props {
    title: string;
    books: Book[];
    containerClassName?: string;
}

const BookList = ({ title, books, containerClassName }: Props) => {

    const { data, isPending, isError, error } = useBooks(1, 12, true, books)

    if (isPending) return;

    return (
        <section className={containerClassName}>
            <h2 className="font-bebas-neue text-4xl text-light-100">{title}</h2>

            <ul className="book-list">
                {
                    data.slice(1).map((book) => (
                        <BookCard
                            key={book.title}
                            {...book}
                        />
                    ))
                }
            </ul>
        </section>
    )
}
export default BookList