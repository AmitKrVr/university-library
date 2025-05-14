import BookForm from "@/components/admin/forms/BookForm"
import { Button } from "@/components/ui/button";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { Link } from "@react-email/components";
import { eq } from "drizzle-orm";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    const bookDetails = await db.select().from(books).where(eq(books.id, id));

    if (!bookDetails || bookDetails.length === 0) {
        return <div>Book not found.</div>;
    }
    return (
        <>
            <Button asChild className="back-btn">
                <Link href="/admin/books" target="_self">Go Back</Link>
            </Button>
            <BookForm type="update" {...bookDetails[0]} />
        </>
    )
}
export default page