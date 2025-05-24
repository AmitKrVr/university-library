'use client'

import Image from "next/image"
import { Button } from "./ui/button"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import Link from "next/link"
import { useBorrowBook } from "@/hooks/useBorrowBook"

interface Props {
    bookId: string,
}

const BorrowBook = ({ bookId }: Props) => {

    const borrowMutation = useBorrowBook();

    const router = useRouter()
    const [borrowing, setBorrowing] = useState(false)
    const pathname = usePathname();

    if (pathname === "/") {
        return (
            <Link href={`/books/${bookId}`} className="flex items-center gap-2 px-5 font-bebas-neue text-xl text-dark-100 mt-4 min-h-14 w-fit bg-primary hover:bg-primary/90 max-md:w-full rounded-md">
                <Image src="/icons/book.svg" alt="book" width={20} height={20} />
                View Book Details
            </Link>
        )
    }

    const handleBorrow = async () => {
        setBorrowing(true);
        borrowMutation.mutate(bookId, {
            onSuccess: () => {
                toast.success("Book borrowed successfully");
                router.push("/my-profile");
            },
            onError: (error: Error) => {
                toast.error("Your account is not verified yet", {
                    description: error.message,
                });
            },
            onSettled: () => {
                setBorrowing(false);
            },
        })
    }
    return (
        <Button onClick={handleBorrow} disabled={borrowing} className="book-overview_btn">
            <Image src="/icons/book.svg" alt="book" width={20} height={20} />
            <p className="font-bebas-neue text-xl text-dark-100">
                {borrowing ? "Borrowing..." : "Borrow Book Request"}
            </p>
        </Button>
    )
}
export default BorrowBook