import BookOverview from "@/components/BookOverview";
import BookList from "@/components/BookList";
import { toast } from "sonner";
import { getBooks } from "@/lib/actions/book";

const Home = async () => {
  const result = await getBooks(1, 12)

  if (!result.success) {
    toast.error("Error", {
      description: result.message,
    })
  }

  const books = result.success ? result.data : [];

  const featuredBook = books[0];
  const restOfBooks = books.slice(1);

  return (
    <>
      {featuredBook && (
        <BookOverview {...featuredBook} />
      )}
      <BookList
        title="Latest Books"
        books={restOfBooks}
        containerClassName="mt-20"
      />
    </>
  )
}

export default Home;
