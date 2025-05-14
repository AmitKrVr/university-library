import { Button } from "@/components/ui/button";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
} from "@/components/ui/pagination"
import { ChevronLeftIcon, ChevronRight, MoreHorizontalIcon } from "lucide-react";


interface Props {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    setPage: (page: number) => void;
}

export default function ProfilePagination({ currentPage, totalItems, itemsPerPage, setPage }: Props) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return (
        <Pagination className="flex justify-end">
            <PaginationContent className="gap-1.5">
                <PaginationItem>
                    <Button variant='ghost' disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)} className="text-white bg-dark-700">
                        <ChevronLeftIcon />
                    </Button>
                </PaginationItem>
                <PaginationItem>
                    <Button disabled className="select-none">{currentPage}</Button>
                </PaginationItem>

                <PaginationItem>
                    <Button disabled className="text-white bg-dark-700 rounded-md" >
                        <MoreHorizontalIcon className="size-4" />
                    </Button>
                </PaginationItem>

                <PaginationItem>
                    <Button variant="ghost" onClick={() => setPage(totalPages)} className="text-white bg-dark-700 select-none">{totalPages}</Button>
                </PaginationItem>
                <PaginationItem>
                    <Button variant="ghost" disabled={currentPage >= totalPages} onClick={() => setPage(currentPage + 1)} className="text-white bg-dark-700 select-none">
                        <ChevronRight />
                    </Button>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}
