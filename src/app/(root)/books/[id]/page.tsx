import { auth } from "@/auth";
import BookCover from "@/components/BookCover";
import BookOverview from "@/components/BookOverview";
import BookVideo from "@/components/BookVideo";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

const BookDetailsPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const session = await auth()

    const [bookDetails] = await db.select().from(books).where(eq(books.id, id)).limit(1);
    const allBooks = await db.select().from(books).limit(6);

    if (!bookDetails) redirect("/404");

    return (
        <>
            <BookOverview {...bookDetails} userId={session?.user?.id as string} />

            <div className="book-details">
                <div className="flex-[1.5]">
                    <section className="flex flex-col gap-7">
                        <h3>Video</h3>

                        <BookVideo videoUrl={bookDetails.videoUrl} />
                    </section>

                    <section className="mt-10 flex flex-col gap-7">
                        <h3>Summary</h3>

                        <div className="space-y-5 text-xl text-light-100">
                            {bookDetails.summary.split("\n").map((line, i) => (
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
                            {allBooks && allBooks.map((book) => (
                                <BookCover
                                    key={book.id}
                                    coverColor={book.coverColor}
                                    coverImage={book.coverUrl}
                                    variant="medium"
                                />
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </>
    )
}
export default BookDetailsPage