"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, UseFormReturn } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { bookSchema } from "@/lib/validations";
import { Textarea } from "@/components/ui/textarea";
import FileUpload from "@/components/FileUpload";
import ColorPicker from "../ColorPicker";
import { createBook, updateBook } from "@/lib/admin/actions/book";

interface Props extends Partial<Book> {
    type?: "create" | "update"
}

const BookForm = ({ type, ...book }: Props) => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const form: UseFormReturn<z.infer<typeof bookSchema>> = useForm({
        resolver: zodResolver(bookSchema),
        defaultValues: {
            title: book.title || "",
            description: book.description || "",
            author: book.author || "",
            genre: book.genre || "",
            rating: book.rating || 1,
            totalCopies: book.totalCopies || 1,
            coverUrl: book.coverUrl || "",
            coverColor: book.coverColor || "",
            videoUrl: book.videoUrl || "",
            summary: book.summary || "",
        }
    })

    const onSubmit = async (values: z.infer<typeof bookSchema>) => {
        setLoading(true)

        const result = type === "update"
            ? await updateBook({ ...values, id: book.id! })
            : await createBook(values);

        if (result.success) {
            if (type === "update") {
                toast.success("Success", {
                    description: "Book updated successfully!"
                })
            } else {
                toast.success("Success", {
                    description: "Book created successfully!"
                })
            }

            router.push(`/books/${result.data.id}`);
        } else {
            toast.error(`Error}`, {
                description: `An error occurred ${result.message}`
            })
        }

        setLoading(false)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem className="flex flex-col gap-1">
                            <FormLabel className="text-base font-normal text-dark-500">
                                Book Title
                            </FormLabel>
                            <FormControl>
                                <Input
                                    required
                                    {...field}
                                    placeholder="Book title"
                                    className="book-form_input min-h-12"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                        <FormItem className="flex flex-col gap-1">
                            <FormLabel className="text-base font-normal text-dark-500">
                                Author
                            </FormLabel>
                            <FormControl>
                                <Input
                                    required
                                    {...field}
                                    placeholder="Book Author"
                                    className="book-form_input min-h-12"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="genre"
                    render={({ field }) => (
                        <FormItem className="flex flex-col gap-1">
                            <FormLabel className="text-base font-normal text-dark-500">
                                Genre
                            </FormLabel>
                            <FormControl>
                                <Input
                                    required
                                    {...field}
                                    placeholder="Book genre"
                                    className="book-form_input min-h-12"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                        <FormItem className="flex flex-col gap-1">
                            <FormLabel className="text-base font-normal text-dark-500">
                                Rating
                            </FormLabel>
                            <FormControl>
                                <Input
                                    required
                                    {...field}
                                    min={1}
                                    max={5}
                                    type="number"
                                    placeholder="Book rating"
                                    className="book-form_input min-h-12"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="totalCopies"
                    render={({ field }) => (
                        <FormItem className="flex flex-col gap-1">
                            <FormLabel className="text-base font-normal text-dark-500">
                                Total Copies
                            </FormLabel>
                            <FormControl>
                                <Input
                                    required
                                    {...field}
                                    min={1}
                                    max={10000}
                                    type="number"
                                    placeholder="Total copies"
                                    className="book-form_input min-h-12"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="coverUrl"
                    render={({ field }) => (
                        <FormItem className="flex flex-col gap-1">
                            <FormLabel className="text-base font-normal text-dark-500">
                                Book Image
                            </FormLabel>
                            <FormControl>
                                <FileUpload
                                    type="image"
                                    accept="image/*"
                                    placeholder="Upload a book cover"
                                    folder="books/covers"
                                    variant="light"
                                    onFileChange={field.onChange}
                                    value={field.value}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name={"coverColor"}
                    render={({ field }) => (
                        <FormItem className="flex flex-col gap-1">
                            <FormLabel className="text-base font-normal text-dark-500">
                                Primary color
                            </FormLabel>
                            <FormControl>
                                <ColorPicker
                                    value={field.value}
                                    onPickerChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name={"description"}
                    render={({ field }) => (
                        <FormItem className="flex flex-col gap-1">
                            <FormLabel className="text-base font-normal text-dark-500">
                                Book Description
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    rows={10}
                                    placeholder="Book description"
                                    className="book-form_input"
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="videoUrl"
                    render={({ field }) => (
                        <FormItem className="flex flex-col gap-1">
                            <FormLabel className="text-base font-normal text-dark-500">
                                Book Trailer
                            </FormLabel>
                            <FormControl>
                                <FileUpload
                                    type="video"
                                    accept="video/*"
                                    placeholder="Upload a book trailer"
                                    folder="books/videos"
                                    variant="light"
                                    onFileChange={field.onChange}
                                    value={field.value}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name={"summary"}
                    render={({ field }) => (
                        <FormItem className="flex flex-col gap-1">
                            <FormLabel className="text-base font-normal text-dark-500">
                                Book Summary
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    rows={5}
                                    placeholder="Book summary"
                                    className="book-form_input"
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={loading} className="book-form_btn bg-primary-admin text-white">
                    {loading ? (
                        <>
                            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                            Adding Book to Library...
                        </>
                    ) : "Add Book to Library"}
                </Button>
            </form>
        </Form>
    )
}
export default BookForm;