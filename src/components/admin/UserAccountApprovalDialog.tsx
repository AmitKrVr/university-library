"use client"

import { useState } from "react"
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"
import { approvedUser } from "@/lib/admin/actions/user"
import { toast } from "sonner"
import Image from "next/image"

const UserAccountApprovalDialog = ({ userId }: { userId: string }) => {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [isApproving, setIsApproving] = useState(false)
    const [error, setError] = useState<string | null>(null)


    const handleAccountApproving = async (event: React.MouseEvent) => {
        event.preventDefault();

        try {
            setIsApproving(true);
            setError(null);
            const result = await approvedUser(userId);

            if (!result.success) {
                setError(result.message);
                setIsApproving(false);
                return;
            }

            toast.success(result.message)

            setOpen(false);
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred");
            setIsApproving(false);
        }
    };


    return (
        <AlertDialog open={open} onOpenChange={(newOpen) => {
            if (isApproving) return;

            setOpen(newOpen)

            if (newOpen) setError(null)
        }}
        >

            <AlertDialogTrigger asChild>
                <Button className="bg-green-100 text-green font-semibold hover:bg-green-200/50 cursor-pointer">
                    Approve Account
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="w-md rounded-xl text-center">

                <Button variant="ghost"
                    onClick={() => setOpen(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <Image
                        alt="close"
                        src="/icons/admin/close.svg"
                        height={15}
                        width={15}
                    />
                </Button>

                <div className="mx-auto mb-4 mt-2 size-16 rounded-full bg-green-400 border-[10px] border-green-100 flex items-center justify-center">
                    <Image
                        alt="warning"
                        src="/icons/admin/tick.svg"
                        width={20}
                        height={20} />
                </div>

                <AlertDialogHeader>
                    <AlertDialogTitle className="text-lg font-semibold text-gray-900 text-center">
                        Approved Account Request
                    </AlertDialogTitle>
                </AlertDialogHeader>

                <AlertDialogDescription className="text-sm text-gray-600 mb-4 px-4">
                    Approve the student’s account request and grant access. A confirmation email will be sent upon approval.
                </AlertDialogDescription>

                {error && (
                    <div className="mb-4 px-4 text-sm text-red-700 bg-red-50 rounded-md">
                        Error: {error}
                    </div>
                )}

                <AlertDialogFooter className="flex flex-col gap-2">
                    <AlertDialogAction
                        disabled={isApproving}
                        onClick={handleAccountApproving}
                        className="bg-green-400 hover:bg-green-400 text-white font-medium w-full py-2 rounded-lg"
                    >
                        {isApproving ? "Approving..." : "Approve & Send Confirmation"}
                    </AlertDialogAction>
                </AlertDialogFooter>


            </AlertDialogContent>
        </AlertDialog>
    )
}
export default UserAccountApprovalDialog