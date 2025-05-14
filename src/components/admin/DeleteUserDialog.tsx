"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteUser } from "@/lib/admin/actions/deleteUser";
import { Button } from "../ui/button";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from "@/components/ui/alert-dialog";

export function DeleteUserDialog({ userId }: { userId: string }) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);

    const handleDeleteUser = async (event: React.MouseEvent) => {
        event.preventDefault();

        try {
            setIsDeleting(true);
            setError(null);
            const result = await deleteUser(userId);

            if (!result.success) {
                setError(result.message);
                setIsDeleting(false);
                return;
            }

            setOpen(false);
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred");
            setIsDeleting(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={(newOpen) => {

            if (isDeleting) return;

            setOpen(newOpen);

            if (newOpen) setError(null);
        }}>
            <AlertDialogTrigger asChild>
                <Button className="cursor-pointer bg-transparent border-0 shadow-none hover:bg-transparent" onClick={() => setOpen(true)}>
                    <Image
                        alt="trash"
                        src="/icons/admin/trash.svg"
                        height={20}
                        width={20}
                    />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription asChild>
                        <div>
                            This action cannot be undone. This will permanently delete the user account and remove user data from your database.
                            {error && (
                                <div className="mt-2 p-2 bg-red-50 text-red-700 rounded-md text-sm">
                                    Error: {error}
                                </div>
                            )}
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting} className="h-10">Cancel</AlertDialogCancel>
                    <Button
                        onClick={handleDeleteUser}
                        disabled={isDeleting}
                        className="inline-flex h-10 items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                    >
                        {isDeleting ? "Deleting..." : "Delete User"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}