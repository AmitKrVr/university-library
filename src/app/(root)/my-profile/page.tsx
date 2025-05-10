import BookList from "@/components/BookList";
import { sampleBooks } from "@/constants";

const ProfilePage = () => {
    return (
        <>
            <BookList title="Borrowed Books" books={sampleBooks} />
        </>
    )
}
export default ProfilePage