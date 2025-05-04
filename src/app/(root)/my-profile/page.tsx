import { signOut } from "@/auth";
import BookList from "@/components/BookList";
import { Button } from "@/components/ui/button"
import { sampleBooks } from "@/constants";

const ProfilePage = () => {
    return (
        <>
            <form
                action={async () => {
                    "use server";
                    await signOut();
                }}
                className="mb-10"
            >
                <Button>Logout</Button>
            </form>

            <BookList title="Borrowed Books" books={sampleBooks} />
        </>
    )
}
export default ProfilePage