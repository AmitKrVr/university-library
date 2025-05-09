'use client'

import Image from "next/image"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { borrowBook } from "@/lib/actions/book"
import { Loader2 } from "lucide-react"

interface Props {
    userId: string,
    bookId: string,
    borrowingEligibility: {
        isEligible: boolean,
        message: string,
    }
}

const BorrowBook = ({ userId, bookId, borrowingEligibility: { isEligible, message } }: Props) => {

    const router = useRouter()
    const [borrowing, setBorrowing] = useState(false)

    const handleBorrow = async () => {
        if (!isEligible) {
            toast.error("Error", {
                description: message
            })
        }

        setBorrowing(true);

        try {
            const result = await borrowBook({ bookId, userId });
            if (result.success) {
                toast.success("Success", {
                    description: "Book borrowed successfully",
                })

                router.push("/my-profile")
            } else {
                toast.error("Error", {
                    description: "An error occurred while borrowing the book",
                })
            }
        } catch (error) {
            toast.error("Error", {
                description: "An error occurred while borrowing the book"
            })
        } finally {
            setBorrowing(false)
        }
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