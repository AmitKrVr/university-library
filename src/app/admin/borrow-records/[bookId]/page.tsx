import BookCover from "@/components/BookCover";
import BookVideo from "@/components/BookVideo";
import { Button } from "@/components/ui/button";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { getMonthAndDayAndYear } from "@/lib/utils";
import { Link } from "@react-email/components";
import { eq } from "drizzle-orm";
import Image from "next/image";

const page = async ({ params }: { params: Promise<{ bookId: string }> }) => {
    const { bookId } = await params;

    const [bookDetails] = await db.select().from(books).where(eq(books.id, bookId));

    if (!bookDetails) return

    return (
        <>
            <Button asChild className="back-btn bg-white text-black! shadow-md border-0">
                <Link target="_self" href="/admin/borrow-records">Go Back</Link>
            </Button>

            <div className="flex gap-7">
                <div
                    className="flex items-center justify-center px-14 py-5 rounded-xl"
                    style={{ backgroundColor: `${bookDetails.coverColor}30` }}
                >
                    <BookCover coverColor={bookDetails.coverColor} coverImage={bookDetails.coverUrl} variant="medium" />
                </div>

                <div className="flex flex-col justify-between">
                    <div className="flex items-center mt-2">
                        <span className="mr-2 font-normal text-light-500">Created at: </span>
                        <Image alt="calendar" src="/icons/admin/calendar.svg" height={16} width={16} className="mr-1" />
                        <span className="text-base">{bookDetails.createdAt ? getMonthAndDayAndYear(bookDetails.createdAt) : "--"}</span>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h2 className="text-2xl font-semibold">{bookDetails.title}</h2>
                        <p className=" text-dark-600 font-semibold">{bookDetails.author}</p>
                        <p className="text-base font-normal text-light-500">{bookDetails.genre}</p>
                        <Button asChild>
                            <Link
                                target="_self"
                                href={`/admin/books/edit/${bookId}`}
                                className="bg-primary-admin text-white! hover:bg-primary-admin/90!">
                                <Image alt="edit" src="/icons/admin/edit-2.svg" height={15} width={15} />
                                Edit Book
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="mt-10 flex gap-5">
                <section className="flex-3/5 space-y-5">
                    <h3 className="text-base font-semibold">Summary</h3>

                    <div className="space-y-5 text-base text-slate-500">
                        {bookDetails.summary?.split("\n").map((line: string, i: number) => (
                            <p key={i}>
                                {line}
                            </p>
                        ))}
                    </div>
                </section>
                <section className="flex-2/5 space-y-5">
                    <h3 className="text-base font-semibold">Video</h3>

                    <BookVideo videoUrl={bookDetails.videoUrl} />
                </section>
            </div>
        </>
    )
}
export default page