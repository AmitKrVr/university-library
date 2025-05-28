import Link from "next/link"
import SectionCard from "./SectionCard"
import Image from "next/image"
import ErrorDisplay from "./ErrorDisplay"
import BookCover from "@/components/BookCover"
import { Dot } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface Data {
    id: string;
    title: string;
    author: string;
    genre: string;
    coverImage: string;
    coverColor: string;
    createdAt: Date | null;
}

interface Props {
    recentBooksResult: {
        data: Data[],
        error: boolean,
        message?: string,
    }
}

const RecentBooksSection = ({ recentBooksResult }: Props) => {
    return (
        <SectionCard
            title="Recently Added Books"
            viewAllHref="/admin/books"
            error={recentBooksResult.error}
            className="space-y-4 max-h-[47.5rem]"
        >
            <Link href="/admin/books/new" className="flex items-center gap-3 bg-light-300 rounded-md p-4 text-lg font-medium">
                <Image
                    alt="add new book"
                    src="icons/admin/plus.svg"
                    height={35}
                    width={35}
                    className="bg-white p-2 rounded-full"
                />
                Add New Book
            </Link>
            {recentBooksResult.error ? (
                <ErrorDisplay message={recentBooksResult.message || "An unknown error occurred."} />
            ) : (
                <div className="space-y-1 mt-6">
                    {recentBooksResult.data.map((book) => (
                        <div key={book.id} className="group flex gap-4 p-3 hover:bg-light-300 rounded-md">
                            <div>
                                <BookCover variant="small" coverColor={book.coverColor} coverImage={book.coverImage} />
                            </div>
                            <div className="">
                                <Link href={`/admin/borrow-records/${book.id}`} className="text-base font-semibold line-clamp-1 group-hover:text-sky-500">{book.title}</Link>
                                <div className="flex items-center gap-1 text-sm font-normal text-slate-500">
                                    <p className="max-w-52 line-clamp-1">{book.author}</p>
                                    <Dot />
                                    <p className="line-clamp-1">{book.genre}</p>
                                </div>
                                <p className="flex items-center gap-1 text-sm font-normal text-slate-500 mt-2">
                                    <Image
                                        alt="calendar"
                                        src="/icons/admin/calendar.svg"
                                        height={15}
                                        width={15}
                                    />
                                    {book.createdAt ? formatDate(book.createdAt, "numeric") : "--"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!recentBooksResult.error && recentBooksResult.data.length > 5 &&
                <div className="absolute z-10 bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
            }
        </SectionCard>
    )
}
export default RecentBooksSection