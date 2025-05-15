import DeleteBookButton from "@/components/admin/DeleteBookButton";
import BookCover from "@/components/BookCover";
import { Button } from "@/components/ui/button";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { getMonthAndDayAndYear } from "@/lib/utils";
import { desc } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";

const BooksPage = async () => {
    const allBooks = await db.select().from(books).limit(12).orderBy(desc(books.createdAt));

    return (
        <section className="w-full rounded-2xl bg-white p-7">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xl font-semibold">All Books</h2>
                <Button className="bg-primary-admin" asChild>
                    <Link href="/admin/books/new" className="text-white">
                        + Create a New Book
                    </Link>
                </Button>
            </div>

            <div className="mt-7 w-full overflow-hidden">
                <Table className="rounded-md overflow-hidden">
                    <TableHeader className="[&_tr]:border-b-0 h-12">
                        <TableRow className="bg-light-300 border-0">
                            <TableHead className="font-light max-w-[300px] truncate">Book Title</TableHead>
                            <TableHead className="font-light max-w-[200px] truncate">Author</TableHead>
                            <TableHead className="font-light">Genre</TableHead>
                            <TableHead className="font-light w-[130px]">Date Created</TableHead>
                            <TableHead className="font-light">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {allBooks.map((book) => (
                            <TableRow key={book.id} className="h-14 border-gray-50">
                                <TableCell className="flex items-center gap-2 font-medium text-dark-200 max-w-[300px] truncate">
                                    <div>
                                        <BookCover variant="extraSmall" coverColor={book.coverColor} coverImage={book.coverUrl} />
                                    </div>
                                    {book.title}
                                </TableCell>
                                <TableCell className="max-w-[200px] truncate">{book.author}</TableCell>
                                <TableCell className="font-medium">{book.genre}</TableCell>
                                <TableCell className="font-medium">
                                    {book.createdAt ? getMonthAndDayAndYear(book.createdAt) : "-"}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-3 w-max">
                                        <Link href={`/admin/books/edit/${book.id}`}>
                                            <Image
                                                alt="edit"
                                                src="/icons/admin/edit.svg"
                                                height={15}
                                                width={15}
                                                className="size-5 cursor-pointer"
                                            />
                                        </Link>
                                        <DeleteBookButton bookId={book.id} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </section>
    );
};

export default BooksPage;
