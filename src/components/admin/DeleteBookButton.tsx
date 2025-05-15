"use client";

import {
    AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader,
    AlertDialogTitle, AlertDialogDescription, AlertDialogFooter,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteBook } from "@/lib/admin/actions/book";

const DeleteBookButton = ({ bookId }: { bookId: string }) => {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);

    const handleDeleteBook = async (event: React.MouseEvent) => {
        event.preventDefault();

        try {
            setIsDeleting(true);
            setError(null);
            const result = await deleteBook(bookId);

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
                        src="/icons/admin/circle-help.svg"
                        width={20}
                        height={20} />
                </div>

                <AlertDialogHeader>
                    <AlertDialogTitle className="text-lg font-semibold text-gray-900 text-center">
                        Delete Book
                    </AlertDialogTitle>
                </AlertDialogHeader>

                <AlertDialogDescription className="text-sm text-gray-600 mb-4 px-4">
                    This action will permanently delete the book and remove all associated data from the system. This action cannot be undone.
                </AlertDialogDescription>

                {error && (
                    <div className="mb-4 px-4 text-sm text-red-700 bg-red-50 rounded-md">
                        Error: {error}
                    </div>
                )}

                <AlertDialogFooter className="flex flex-col gap-2">
                    <AlertDialogAction
                        disabled={isDeleting}
                        onClick={handleDeleteBook}
                        className="bg-red-400 hover:bg-red-600/70 text-white font-medium w-full py-2 rounded-lg"
                    >
                        {isDeleting ? "Deleting..." : "Delete Book"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteBookButton;
