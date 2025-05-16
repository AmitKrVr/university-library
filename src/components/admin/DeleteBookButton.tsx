"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteBook } from "@/lib/admin/actions/book";
import { ReusableAlertDialog } from "./ReusableAlertDialog";

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
        <ReusableAlertDialog
            open={open}
            setOpen={setOpen}
            isLoading={isDeleting}
            error={error}
            setError={setError}
            icon="/icons/admin/circle-help.svg"
            iconBg="bg-red-400"
            iconBorder="border-[10px] border-red-100"
            title="Delete Book"
            description="This action will permanently delete the book and remove all associated data. It cannot be undone."
            actionText="Delete Book"
            onAction={handleDeleteBook}
            trigger={
                <Button className="cursor-pointer bg-transparent border-0 shadow-none hover:bg-transparent">
                    <Image alt="trash" src="/icons/admin/trash.svg" height={20} width={20} />
                </Button>
            }
            actionBtnColor="bg-red-400 hover:bg-red-600/70"
        />
    );
};

export default DeleteBookButton;
