"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Image from "next/image"
import { toast } from "sonner"
import { useQuery } from "@tanstack/react-query"

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import BookCard from "@/components/BookCard"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

import { getBooks, getBooksCount } from "@/lib/actions/book"
import { searchBooks, countTotalBooks } from "@/lib/actions/searchBooks"
import { getPaginationRange } from "@/lib/utils"

const formSchema = z.object({
    query: z.string().min(2, "Please enter atleast 2 characters")
})

type FormData = z.infer<typeof formSchema>

const SearchPage = () => {
    const searchParams = useSearchParams()
    const router = useRouter()

    const currentParams = new URLSearchParams(searchParams.toString());

    const query = searchParams.get("query") || ""
    const page = parseInt(searchParams.get("page") || "1", 10)
    const booksPerPage = 12

    const updatePage = (pageNumber: number) => {
        currentParams.set("page", String(pageNumber));
        router.push(`/search?${currentParams.toString()}`);
    }

    const {
        data: booksData = [],
        isLoading: isLoadingBooks,
        isError: isBooksError,
        error: booksError,
    } = useQuery({
        queryKey: ['books', query, page],
        queryFn: async () => {
            if (query && query.length >= 2) {
                return await searchBooks(query, page)
            }

            const result = await getBooks(page)
            return result.success ? result.data : []
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
    })

    const {
        data: totalBooksCount = 0,
        isLoading: isLoadingCount,
        isError: isCountError,
        error: countError
    } = useQuery({
        queryKey: ['booksCount', query],
        queryFn: async () => {
            if (query && query.length >= 2) {
                return await countTotalBooks(query)
            }
            const result = await getBooksCount()
            return result.success ? result.data : 0
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1
    })

    const hasSearched = query.length >= 2
    const totalPages = Math.ceil(totalBooksCount / booksPerPage)
    const isLoading = isLoadingBooks || isLoadingCount
    const hasError = isBooksError || isCountError


    if (hasError) {
        const errorMessage = booksError?.message || countError?.message || "An error occurred while fetching data"
        toast.error("Error", { description: errorMessage })
    }

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: { query: query || "" },
        mode: "onChange",
    })

    const queryValue = form.watch("query")
    const queryError = form.formState.errors.query?.message

    const onSubmit = (data: FormData) => {
        const query = data.query.trim()
        const params = new URLSearchParams(searchParams.toString())

        if (query && query.length < 2) {
            toast.error("Please enter at least 2 characters")
            return
        }

        if (query.length > 1) {
            params.set("query", query)
            params.set("page", "1") // Reset to page 1 on every search
        } else {
            params.delete("query")
            params.set("page", "1")
        }

        router.push(`/search?${params.toString()}`)
    }

    const clearSearch = () => {
        form.reset()
        const params = new URLSearchParams(searchParams.toString())
        params.delete("query")
        params.set("page", "1")
        router.push(`/search?${params.toString()}`)
    }

    const paginationRange = getPaginationRange(page, totalPages);

    return (
        <div>
            <section className="flex flex-col items-center text-white space-y-7">
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
                                <FormItem className="relative">
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
                                                    disabled={isLoading}
                                                    onChange={(e) => {
                                                        field.onChange(e)
                                                        const newValue = e.target.value.trim()

                                                        if (newValue.length === 0) {
                                                            const params = new URLSearchParams(searchParams.toString())
                                                            params.delete("query")
                                                            params.set("page", "1")
                                                            router.push(`/search?${params.toString()}`)
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </FormControl>
                                        <Button
                                            type="submit"
                                            disabled={isLoading || (queryValue?.trim().length ?? 0) < 2}
                                            className="bg-light-100 text-dark-100 sm:text-lg min-h-14 w-24 min-w-24 md:w-1/5 rounded-md font-medium hover:bg-light-100/80 transition"
                                        >
                                            {isLoading ? "Searching..." : "Search"}
                                        </Button>
                                    </div>
                                    {(queryValue && queryValue.length < 2 && queryError) && (
                                        <p className="absolute -bottom-5 text-xs text-red-500 -mt-1">{queryError}</p>
                                    )}
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
                    </div>

                    {isLoadingBooks ? (
                        <div className="flex items-center justify-center w-full mt-14">
                            <div className="flex flex-col items-center justify-center gap-3">
                                <p className="text-light-100">Loading books...</p>
                            </div>
                        </div>
                    ) : booksData.length > 0 ? (
                        <>
                            <ul className="book-list mt-8 flex flex-wrap">
                                {booksData.map((book) => (
                                    <BookCard key={book.id} {...book} />
                                ))}
                            </ul>

                            {totalPages > 1 && (
                                <Pagination className="flex justify-end mt-10">
                                    <PaginationContent className="flex flow-row gap-3">
                                        <PaginationItem>
                                            <PaginationPrevious
                                                onClick={() => {
                                                    if (page > 1) updatePage(page - 1);
                                                }}
                                                aria-disabled={page <= 1}
                                                className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                                            />
                                        </PaginationItem>
                                        {paginationRange.map((item, idx) => (
                                            <PaginationItem key={idx}>
                                                {item === "..." ? (
                                                    <PaginationEllipsis />
                                                ) : (
                                                    <PaginationLink
                                                        onClick={() => updatePage(Number(item))}
                                                        isActive={page === item}
                                                        className={`${page === idx + 1 ? "text-dark-100 bg-primary" : ""}`}
                                                    >
                                                        {item}
                                                    </PaginationLink>
                                                )}
                                            </PaginationItem>
                                        ))}
                                        <PaginationItem>
                                            <PaginationNext
                                                onClick={() => {
                                                    if (page < totalPages) updatePage(page + 1);
                                                }}
                                                aria-disabled={page >= totalPages}
                                                className={`${page >= totalPages ? "pointer-events-none opacity-50" : ""} `}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            )}
                        </>
                    ) : (hasSearched ? (
                        <div className="flex items-center justify-center w-full mt-14">
                            <div className="max-w-96 flex flex-col items-center justify-center gap-3">
                                <Image
                                    alt="no result"
                                    src="/icons/no-results.svg"
                                    height={180}
                                    width={180}
                                    className="object-contain"
                                />
                                <h3 className="text-xl text-light-100 font-semibold">No Results Found</h3>
                                <p className="font-normal text-base text-center text-light-100">We couldn&apos;t find any books matching your search. Try using different keywords or check for typos.</p>
                                <Button
                                    onClick={clearSearch}
                                    className="font-bebas-neue w-full h-11 text-dark-100 text-xl font-normal tracking-wider"
                                >Clear search</Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center w-full mt-14">
                            <p className="text-light-100">No books available.</p>
                        </div>
                    ))}
                </section>
            </section>
        </div>
    )
}

export default SearchPage