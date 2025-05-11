"use client"

import { searchBooks, countTotalBooks } from "@/lib/actions/searchBooks"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback, useEffect, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import BookCard from "@/components/BookCard"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { getBooks, getBooksCount } from "@/lib/actions/book"
import { toast } from "sonner"

const formSchema = z.object({
    query: z.string().min(2, "Please enter at least 2 characters"),
})

type FormData = z.infer<typeof formSchema>

const SearchPage = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [allBooks, setAllBooks] = useState<any[]>([])
    const [isPending, startTransition] = useTransition()
    const [hasSearched, setHasSearched] = useState(false)

    const [totalBooks, setTotalBooks] = useState(0)
    const booksPerPage = 12;

    const query = searchParams.get("query");
    const page = searchParams.get("page");
    const totalPages = Math.ceil(totalBooks / booksPerPage)

    const currentPage = parseInt(page || "1", 10)


    const fetchAllBooks = async () => {
        const bookData = await getBooks(currentPage);
        if (!bookData.success) {
            toast.error("Error", { description: bookData.message });
            return;
        }
        const total = await getBooksCount();
        if (!total.success) {
            toast.error("Error", { description: total.message });
            return;
        }
        setAllBooks(bookData.data);
        setTotalBooks(total.data ?? 0);
        setHasSearched(false);
    };

    const fetchSearchResults = async () => {
        if (query && query.length >= 2) {
            const result = await searchBooks(query, currentPage);
            const total = await countTotalBooks(query);
            setAllBooks(result);
            setTotalBooks(total);
        }

        setHasSearched(true);
    };

    useEffect(() => {
        startTransition(() => {
            if (query && query.length >= 2) {
                fetchSearchResults();
            } else {
                fetchAllBooks();
            }
        });
    }, [page, query, currentPage]);


    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set(name, value)
            return params.toString()
        },
        [searchParams]
    )

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: { query: "" },
    })

    const onSubmit = (data: FormData) => {
        const query = data.query.trim();

        const params = new URLSearchParams(searchParams.toString());

        if (query.length > 0) {
            params.set("query", query);
            params.set("page", "1"); //reset 1 on every search
        } else {
            params.delete("query");
            params.set("page", "1");
        }

        router.push(`/search?${params.toString()}`)
    }

    return (
        <div>
            <section className="flex flex-col items-center text-white sm:py-5 space-y-7">
                <div className="text-center space-y-2 max-w-3xl">
                    <h3 className="font-bebas-neue text-xl font-semibold tracking-widest text-light-100">
                        Discover Your Next Great Read:
                    </h3>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white max-w-xl leading-14">
                        Explore and Search for <span className="text-light-200">Any Book</span> In Our Library
                    </h2>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="relative w-full max-w-2xl space-y-4">
                        <FormField
                            control={form.control}
                            name="query"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex gap-2">
                                        <FormControl className="w-full">
                                            <div className="relative">
                                                <Image
                                                    src="/icons/search-fill.svg"
                                                    alt="search"
                                                    height={20}
                                                    width={20}
                                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-light-100"
                                                />
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    placeholder="Search books"
                                                    className="form-input pl-12 text-lg!"
                                                    disabled={isPending}
                                                />
                                            </div>
                                        </FormControl>
                                        <Button
                                            type="submit"
                                            disabled={isPending}
                                            className="bg-light-100 text-dark-100 sm:text-lg min-h-14 w-24 min-w-24 md:w-1/5 rounded-md font-medium hover:bg-light-100/80 transition"
                                        >
                                            {isPending ? "Searching..." : "Search"}
                                        </Button>
                                    </div>
                                    <FormMessage className="text-red-500 -mt-1 text-xs" />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>

                <section className="w-full">
                    <div className="flex flex-wrap gap-4 justify-between items-center">
                        <h2 className="text-3xl font-semibold text-light-100">
                            {hasSearched ? "Search Results" : "All Books"}
                        </h2>

                        {/* <div className="flex flex-wrap gap-3 items-center">
                                <Select>
                                    <SelectTrigger className="w-40 min-h-12 bg-dark-700 text-white">
                                        <SelectValue placeholder="Filter by:" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Filter by:</SelectLabel>
                                            <SelectItem value="author">Author</SelectItem>
                                            <SelectItem value="genre">Genre</SelectItem>
                                            <SelectItem value="rating">Rating</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div> */}
                    </div>

                    {allBooks.length > 0
                        ? (
                            <>
                                <ul className="book-list mt-8 flex flex-wrap">
                                    {allBooks.map((book) => (
                                        <BookCard key={book.id} {...book} />
                                    ))}
                                </ul>

                                {totalPages > 1 && (
                                    <Pagination className="flex justify-end mt-10">
                                        <PaginationContent className="flex flow-row gap-3">
                                            <PaginationItem>
                                                <PaginationPrevious
                                                    href={parseInt(page || "1") > 1 ? `/search?${createQueryString("page", String(Math.max(1, parseInt(page || "1") - 1)))}` : undefined}
                                                    aria-disabled={parseInt(page || "1") <= 1}
                                                    className={parseInt(page || "1") <= 1 ? "pointer-events-none opacity-50" : ""}
                                                />
                                            </PaginationItem>
                                            {Array.from({ length: totalPages }, (_, i) => (
                                                <PaginationItem key={i}>
                                                    <PaginationLink href={`/search?${createQueryString("page", String(i + 1))}`}
                                                        isActive={page === String(i + 1)}
                                                        className={`${page === String(i + 1) ? "text-dark-100" : ""}`}
                                                    >
                                                        {i + 1}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            ))}
                                            <PaginationItem>
                                                <PaginationNext
                                                    href={parseInt(page || "1") < totalPages ? `/search?${createQueryString("page", String(Math.min(totalPages, parseInt(page || "1") + 1)))}` : undefined}
                                                    aria-disabled={parseInt(page || "1") >= totalPages}
                                                    className={parseInt(page || "1") >= totalPages ? "pointer-events-none opacity-50" : ""}
                                                />
                                            </PaginationItem>
                                        </PaginationContent>
                                    </Pagination>
                                )}
                            </>
                        ) : (
                            allBooks.length <= 0 && hasSearched) ? (
                            <div className="text-3xl text-light-100 font-bold text-center py-10">
                                No books found matching your search.
                            </div>
                        ) : ""}
                </section>
            </section>
        </div>
    )
}

export default SearchPage