import BorrowedStatus from "@/components/admin/BorrowedStatus";
import BookCover from "@/components/BookCover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { db } from "@/database/drizzle";
import { books, borrowRecords, users } from "@/database/schema";
import { cn, getColorForUser, getInitials, getMonthAndDayAndYear } from "@/lib/utils";
import { asc, desc, eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";

const BorrowPage = async ({ searchParams }: { searchParams: Promise<{ sort: string }> }) => {
    const { sort: rawSort = 'recent' } = await searchParams;
    const sort = ['oldest', 'recent'].includes(rawSort) ? rawSort : 'recent';
    const sortOrder = sort === 'oldest' ? 'asc' : 'desc';

    const borrowdRequest = await db.select({
        borrowRecord: borrowRecords,
        name: users.fullName,
        email: users.email,
        title: books.title,
        coverColor: books.coverColor,
        coverImage: books.coverUrl,
    })
        .from(borrowRecords)
        .leftJoin(users, eq(users.id, borrowRecords.userId))
        .leftJoin(books, eq(books.id, borrowRecords.bookId))
        .orderBy(sortOrder === "asc" ? asc(borrowRecords.createdAt) : desc(borrowRecords.createdAt))
        .limit(12)


    const isOldest = sort === 'oldest'
    const nextSort = isOldest ? 'recent' : 'oldest'

    const sortLabel = isOldest ? 'Recent to Oldest' : 'Oldest to Recent'
    const sortIcon = (
        <Image
            alt="sort"
            src="/icons/admin/arrow-swap.svg"
            height={15}
            width={15}
            className={borrowdRequest.length <= 1 ? "invert-100" : ""}
        />
    )

    const statusMap = {
        BORROWED: {
            label: "Borrowed",
            className: "text-violet-800 bg-violet-100",
        },
        RETURNED: {
            label: "Returned",
            className: "text-blue-800 bg-light-100",
        },
        LATERETURN: {
            label: "Late Return",
            className: "text-red bg-red-100",
        },
    };

    return (
        <section className="w-full rounded-2xl bg-white p-7">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xl font-semibold">
                    Borrow Book Requests
                </h2>

                {borrowdRequest.length <= 1 ? (
                    <Button disabled className="bg-primary-admin text-white">
                        {sortLabel} {sortIcon}
                    </Button>
                ) : (
                    <Link
                        href={`?sort=${nextSort}`}
                        className="bg-white text-black border border-gray-50 hover:bg-light-300 h-8 px-3 inline-flex items-center gap-1 rounded-md text-sm font-medium"
                    >
                        {sortLabel} {sortIcon}
                    </Link>
                )}
            </div>
            <div className="mt-5">
                <Table className="rounded-md overflow-hidden">
                    <TableHeader className="[&_tr]:border-b-0 h-14">
                        <TableRow className="bg-light-300 border-0">
                            <TableHead className="font-light">Book</TableHead>
                            <TableHead className="font-light">User Request</TableHead>
                            <TableHead className="font-light">Status</TableHead>
                            <TableHead className="font-light w-[130px]">Borrowed Date</TableHead>
                            <TableHead className="font-light">Return Date</TableHead>
                            <TableHead className="font-light">Due Date</TableHead>
                            <TableHead className="font-light">Receipt</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="">
                        {borrowdRequest.map((book) => {
                            const status = book.borrowRecord.status;
                            const statusInfo = statusMap[status as keyof typeof statusMap];

                            return (
                                <TableRow key={book.borrowRecord.id} className="h-[5rem] border-gray-50">
                                    <TableCell className="font-medium text-dark-200 max-w-[300px] truncate">
                                        <div className="flex items-center gap-2 ">
                                            <div>
                                                <BookCover variant="extraSmall" coverColor={book.coverColor ?? ''} coverImage={book.coverImage ?? ''} />
                                            </div>
                                            {book.title}
                                        </div>
                                    </TableCell>

                                    <TableCell className="min-w-max">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-9 w-9">
                                                <AvatarFallback className={`${getColorForUser(book?.name || "")} font-medium`}>
                                                    {getInitials(book?.name || "XX")}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-semibold text-[#1E293B]">{book.name}</p>
                                                <p className="text-[#64748B] text-sm">{book.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell
                                        className="text-xs font-medium"
                                    >
                                        <Popover>
                                            <PopoverTrigger
                                                key={book.borrowRecord.id}
                                                className={cn(
                                                    statusInfo?.className,
                                                    "py-1.5 px-3 w-max rounded-full tracking-wider cursor-pointer"
                                                )}
                                            >
                                                {statusInfo?.label}
                                            </PopoverTrigger>
                                            <PopoverContent className="mt-2 w-max space-y-2 border border-gray-200 shadow-2xl">
                                                <BorrowedStatus currentStatus={book.borrowRecord.status} id={book.borrowRecord.id} />
                                            </PopoverContent>
                                        </Popover>
                                    </TableCell>

                                    <TableCell className="font-medium text-dark-200">
                                        {book.borrowRecord.borrowDate ? getMonthAndDayAndYear(book.borrowRecord.borrowDate) : "--"}
                                    </TableCell>

                                    <TableCell className={`${book.borrowRecord.returnDate ? "text-left" : "text-center"} font-medium text-dark-200 `}>
                                        {book.borrowRecord.returnDate ? book.borrowRecord.returnDate : "--"}
                                    </TableCell>

                                    <TableCell className={`${book.borrowRecord.dueDate ? "text-left" : "text-center"} font-medium text-dark-200 `}>
                                        {book.borrowRecord.dueDate ? book.borrowRecord.dueDate : "--"}
                                    </TableCell>

                                    <TableCell>
                                        <Button className="flex gap-1 font-medium cursor-pointer items-center bg-light-100 text-[#25388C] hover:bg-light-100">
                                            <Image
                                                alt="reciept"
                                                src="/icons/admin/receipt.svg"
                                                width={15}
                                                height={15}
                                            />
                                            Generate
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div >
        </section >
    );
};
export default BorrowPage;
