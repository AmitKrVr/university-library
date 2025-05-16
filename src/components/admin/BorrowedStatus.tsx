"use client"

import { borrowStatus } from "@/lib/admin/actions/book"
import { Button } from "../ui/button"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Loader2 } from "lucide-react"

type Props = {
    id: string
    currentStatus: "BORROWED" | "RETURNED" | "LATERETURN"
}

const statusStyles: Record<
    "BORROWED" | "RETURNED" | "LATERETURN",
    { label: string; className: string }
> = {
    BORROWED: {
        label: "Borrowed",
        className:
            "text-violet-800 bg-violet-100 hover:bg-violet-200/70",
    },
    RETURNED: {
        label: "Returned",
        className:
            "text-blue-800 bg-light-100 hover:bg-blue-200/70",
    },
    LATERETURN: {
        label: "Late Return",
        className: "text-red bg-red-100 hover:bg-red-200/70",
    },
}


const BorrowedStatus = ({ id, currentStatus }: Props) => {
    const router = useRouter();
    const [loading, setLoading] = useState<"BORROWED" | "RETURNED" | "LATERETURN" | null>(null)

    const handleBorrowedStatus = async (newStatus: "BORROWED" | "RETURNED" | "LATERETURN") => {

        if (currentStatus === newStatus) {
            toast.error("Book is already in this status")
            return
        }

        try {
            setLoading(newStatus)
            const result = await borrowStatus(id, newStatus)

            if (!result.success) {
                toast.error(result.message)
                return
            }

            toast.success(result.message);
            router.refresh();
        } catch (err) {
            toast.error("Something went wrong while updating status.")
        } finally {
            setLoading(null)
        }
    }

    return (
        <div className="grid gap-2">
            {(["BORROWED", "RETURNED", "LATERETURN"] as const).map((status) => {
                const { label, className } = statusStyles[status]
                return (
                    <Button
                        key={status}
                        onClick={() => handleBorrowedStatus(status)}
                        disabled={loading !== null}
                        className={`font-semibold tracking-wider text-xs rounded-full h-7 cursor-pointer ${className}`}
                    >
                        {loading === status && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
                        {label}
                    </Button>
                )
            })}
        </div>
    )
}
export default BorrowedStatus;


