"use client"

import { useState } from "react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"
import { useRouter } from "next/navigation"
import { rejectUser } from "@/lib/admin/actions/user"
import { toast } from "sonner"
import Image from "next/image"

const UserAccountRejectDialog = ({ userId }: { userId: string }) => {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [isApproving, setIsApproving] = useState(false)
    const [error, setError] = useState<string | null>(null)


    const handleAccountReject = async (event: React.MouseEvent) => {
        event.preventDefault();

        try {
            setIsApproving(true);
            setError(null);
            const result = await rejectUser(userId);

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
                <Image
                    alt="reject"
                    src="/icons/admin/circle-x.svg"
                    height={15}
                    width={15}
                    className="size-5 cursor-pointer"
                />
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action will reject the user&apos;s account approval request. This cannot be undone. Are you sure you want to proceed?

                        {error && (
                            <div className="mt-2 p-2 bg-red-50 text-red-700 rounded-md text-sm">
                                Error: {error}
                            </div>
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction disabled={isApproving} onClick={handleAccountReject} className="bg-red-200 text-red font-semibold hover:bg-red-200">
                        {isApproving ? "Rejecting..." : "Reject user"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
export default UserAccountRejectDialog