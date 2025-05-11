import { auth } from "@/auth";
import BookList from "@/components/BookList";
import BookOverview from "@/components/BookOverview";
import { getBooks } from "@/lib/actions/book";
import { toast } from "sonner";

const Home = async () => {

  const session = await auth();
  const result = await getBooks(1, 12)

  if (!result.success) {
    toast.error("Error", {
      description: result.message,
    })
  }

  const books = result.success ? result.data : [];

  return (
    <>
      <BookOverview {...books[0]} userId={session?.user?.id as string} />

      <BookList
        title='Latest Books'
        books={books.slice(1)}
        containerClassName="mt-20"
      />
    </>
  );
}

export default Home;
