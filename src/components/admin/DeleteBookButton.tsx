"use client";

import {
    AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader,
    AlertDialogTitle, AlertDialogDescription, AlertDialogFooter,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteBook } from "@/lib/admin/actions/book";

const DeleteBookButton = ({ bookId }: { bookId: string }) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
        setError(null);
        const result = await deleteBook(bookId);

        if (result.success) {
            startTransition(() => {
                router.refresh();
            });
        } else {
            setError(result.error ?? "Something went wrong.");
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" className="h-auto p-0">
                    <Image
                        alt="delete"
                        src="/icons/admin/trash.svg"
                        height={20}
                        width={20}
                        className="cursor-pointer"
                    />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the book.
                        {error && (
                            <div className="mt-2 p-2 bg-red-100 text-red-600 rounded-md text-sm">
                                {error}
                            </div>
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                    <Button onClick={handleDelete} disabled={isPending} variant="destructive">
                        {isPending ? "Deleting..." : "Delete"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteBookButton;
