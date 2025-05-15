"use client"

import { useState } from "react"
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"
import { useRouter } from "next/navigation"
import { rejectUser } from "@/lib/admin/actions/user"
import { toast } from "sonner"
import Image from "next/image"
import { Button } from "../ui/button"

const UserAccountRejectDialog = ({ userId }: { userId: string }) => {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [isRejecting, setIsRejecting] = useState(false)
    const [error, setError] = useState<string | null>(null)


    const handleAccountReject = async (event: React.MouseEvent) => {
        event.preventDefault();

        try {
            setIsRejecting(true);
            setError(null);
            const result = await rejectUser(userId);

            if (!result.success) {
                setError(result.message);
                setIsRejecting(false);
                return;
            }

            toast.success(result.message)

            setOpen(false);
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred");
            setIsRejecting(false);
        }
    };


    return (
        <AlertDialog open={open} onOpenChange={(newOpen) => {
            if (isRejecting) return;

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

                <div className="mx-auto mb-4 mt-2 size-16 rounded-full bg-red-400 border-[10px] border-red-100 flex items-center justify-center">
                    <Image
                        alt="warning"
                        src="/icons/admin/circle-alert.svg"
                        width={20}
                        height={20} />
                </div>

                <AlertDialogHeader>
                    <AlertDialogTitle className="text-lg font-semibold text-gray-900 text-center">
                        Deny Account Request
                    </AlertDialogTitle>
                </AlertDialogHeader>

                <AlertDialogDescription className="text-sm text-gray-600 mb-4 px-4">
                    Denying this request will notify the student they’re not eligible due to unsuccessful ID card verification.
                </AlertDialogDescription>

                {error && (
                    <div className="mb-4 px-4 text-sm text-red-700 bg-red-50 rounded-md">
                        Error: {error}
                    </div>
                )}

                <AlertDialogFooter className="flex flex-col gap-2">
                    <AlertDialogAction
                        disabled={isRejecting}
                        onClick={handleAccountReject}
                        className="bg-red-400 hover:bg-red-600/70 text-white font-medium w-full py-2 rounded-lg"
                    >
                        {isRejecting ? "Rejecting..." : "Deny & Notify Student"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
export default UserAccountRejectDialog