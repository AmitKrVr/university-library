"use client"

import { pdf } from "@react-pdf/renderer";
import ReceiptDocument from "./ReceiptDocument";
import Image from "next/image";
import { ReactNode } from "react";

interface Props {
    borrow: {
        id: string;
        userId: string;
        bookId: string;
        borrowDate: Date;
        dueDate: string;
        returnDate: string | null;
        status: "BORROWED" | "RETURNED" | "LATERETURN";
        createdAt: Date | null;
    };
    book: Book,
    children?: ReactNode
}

const ReceiptDownloader = ({ borrow, book, children }: Props) => {
    const handleDownload = async () => {
        try {
            const blob = await pdf(<ReceiptDocument borrow={borrow} book={book} />).toBlob();
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = `BookWise_Receipt_${book.title.replace(/[^a-z0-9]/gi, "_")}_${new Date().toISOString().split("T")[0]}.pdf`;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Failed to download receipt", error);
        }
    };

    return children ? (
        <div onClick={handleDownload} className="cursor-pointer" title="Download Receipt as PDF">
            {children}
        </div>
    ) : (
        <Image
            alt="receipt"
            src="/icons/receipt.svg"
            height={20}
            width={20}
            className="h-8 w-8 p-2 rounded-md cursor-pointer hover:opacity-80 transition-opacity"
            style={{ backgroundColor: `${book.coverColor}80` }}
            onClick={handleDownload}
            title="Download Receipt as PDF"
        />
    )
};

export default ReceiptDownloader;
