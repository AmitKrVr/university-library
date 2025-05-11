import { auth } from "@/auth";
import BookCover from "@/components/BookCover";
import BookOverview from "@/components/BookOverview";
import BookVideo from "@/components/BookVideo";
import { getBookDetails, getBooks } from "@/lib/actions/book";
import Link from "next/link";
import { redirect } from "next/navigation";
import { toast } from "sonner";

const BookDetailsPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const session = await auth()

    const bookDetails = await getBookDetails(id)
    const allBooks = await getBooks(1)

    if (!allBooks.success) {
        toast.error("Error", {
            description: allBooks.message
        })
    }

    if (!bookDetails.success) redirect("/404");
    const book = bookDetails?.data[0]

    return (
        <>
            <BookOverview {...book} userId={session?.user?.id as string} />

            <div className="book-details">
                <div className="flex-[1.5]">
                    <section className="flex flex-col gap-7">
                        <h3>Video</h3>

                        <BookVideo videoUrl={book.videoUrl} />
                    </section>

                    <section className="mt-10 flex flex-col gap-7">
                        <h3>Summary</h3>

                        <div className="space-y-5 text-xl text-light-100">
                            {book.summary?.split("\n").map((line, i) => (
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
                            {allBooks?.success && allBooks?.data?.slice(1, 7).map((book) => (
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