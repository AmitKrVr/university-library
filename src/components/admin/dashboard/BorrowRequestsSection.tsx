import BookCover from "@/components/BookCover"
import EmptyState from "./EmptyState"
import SectionCard from "./SectionCard"
import { Dot } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatDate, getColorForUser, getInitials } from "@/lib/utils"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import ErrorDisplay from "./ErrorDisplay"

interface BorrowRequest {
    bookId: string;
    borrowDate: Date;
    name: string | null;
    email: string | null;
    title: string | null;
    author: string | null;
    genre: string | null;
    coverUrl: string | null;
    coverColor: string | null;
}

interface Props {
    borrowRequests: {
        data: BorrowRequest[];
        error: boolean;
        message?: string;
    };
}

const BorrowRequestsSection = ({ borrowRequests }: Props) => {
    return (
        <SectionCard
            title="Borrow Requests"
            viewAllHref="/admin/borrow-records"
            error={borrowRequests.error}
            className="h-[24.5rem]"
        >
            {borrowRequests.error ? (
                <ErrorDisplay message={borrowRequests.message || "An unknown error occurred."} />
            ) : (
                <div className="space-y-3">
                    {borrowRequests.data.length === 0
                        ? (
                            <EmptyState
                                imageAlt="empty-borrow-requests"
                                imageSrc="/icons/admin/empty-borrow-request.svg"
                                title="No Pending Book Requests"
                                description="There are no borrow book requests awaiting your review at this time."
                            />
                        ) : (
                            borrowRequests.data.map((item) => (
                                <div key={item.bookId} className="bg-light-300 rounded-lg p-4 flex justify-between">
                                    <div className="flex gap-4">
                                        <div>
                                            <BookCover variant="small" coverColor={item.coverColor ?? "#012B48"} coverImage={item.coverUrl ?? "https://placehold.co/400x600.png"} />
                                        </div>
                                        <div className="space-x-3">
                                            <p className="text-base font-semibold line-clamp-1">{item.title}</p>
                                            <div className="flex items-center gap-1 text-sm font-normal text-slate-500">
                                                <p className="max-w-52 line-clamp-1">{item.author}</p>
                                                <Dot />
                                                <p className="line-clamp-1">{item.genre}</p>
                                            </div>
                                            <div className="flex items-center gap-4 mt-2">
                                                <div className="flex gap-1 items-center">
                                                    <Avatar className="h-5 w-5 text-xs font-medium">
                                                        <AvatarFallback className={getColorForUser(item.bookId || "---")}>
                                                            {getInitials(item.name || "XX")}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <p className="text-sm font-normal">{item.name}</p>
                                                </div>
                                                <p className="flex items-center gap-1 text-sm font-normal text-slate-500">
                                                    <Image
                                                        alt="calendar"
                                                        src="/icons/admin/calendar.svg"
                                                        height={15}
                                                        width={15}
                                                    />
                                                    {formatDate(item.borrowDate, "numeric")}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <Button asChild>
                                        <Link href={`/admin/borrow-records/${item.bookId}`} className="bg-white hover:bg-white/80 !px-2">
                                            <Image
                                                alt="view"
                                                src="/icons/admin/eye.svg"
                                                height={20}
                                                width={20}
                                                className="h-full w-full"
                                            />
                                        </Link>
                                    </Button>
                                </div>
                            ))
                        )}
                </div>)}

            {!borrowRequests.error && borrowRequests.data.length > 2 &&
                <div className="absolute z-10 bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
            }
        </SectionCard>
    )
}
export default BorrowRequestsSection