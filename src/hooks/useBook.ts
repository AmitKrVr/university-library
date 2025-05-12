import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios"

export function useBooks(page = 1, limit = 12, isInitial?: boolean, initialData?: Book[],) {
    return useQuery({
        queryKey: ["books", page, limit],
        queryFn: async () => {
            try {
                const response = await axios.get("/api/books", { params: { page, limit } });
                return response.data;
            } catch (error: any) {
                const message = error.response?.data?.error || "Failed to fetch books";
                throw new Error(message);
            }
        },
        staleTime: 1000 * 60 * 5,
        placeholderData: isInitial ? initialData : keepPreviousData,
    });
}

export function useBook(id: string) {
    return useQuery({
        queryKey: ["book", id],
        queryFn: async () => {
            try {
                const response = await axios.get(`/api/books/${id}`);
                return response.data;
            } catch (error: any) {
                const message = error.response?.data?.error || "Failed to fetch book details"
                throw new Error(message)
            }
        },
        staleTime: 1000 * 60 * 5,
    })
}

