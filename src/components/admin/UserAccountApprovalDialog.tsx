"use client"

import { useState } from "react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"
import { approvedUser } from "@/lib/admin/actions/user"
import { toast } from "sonner"

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
                <Button className="bg-green-200 text-green font-semibold hover:bg-green-200 cursor-pointer">
                    Approve Account
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        account and remove your data from our servers.

                        {error && (
                            <div className="mt-2 p-2 bg-red-50 text-red-700 rounded-md text-sm">
                                Error: {error}
                            </div>
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction disabled={isApproving} onClick={handleAccountApproving} className="bg-green-200 text-green font-semibold hover:bg-green-200">
                        {isApproving ? "Approving..." : "Approve user"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
export default UserAccountApprovalDialog