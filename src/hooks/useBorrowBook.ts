import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useBorrowBook() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (bookId: string) => {
            try {
                const { data } = await axios.post("/api/books/borrow", { bookId });
                return data;
            } catch (error: any) {
                const message = error.response?.data?.error || "Failed to borrow book"
                throw new Error(message)
            }
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["books"] });
            queryClient.invalidateQueries({ queryKey: ["book", variables] });
            queryClient.invalidateQueries({ queryKey: ["user-profile"] });

            queryClient.setQueryData(['book', variables], (oldData: any) => {
                if (oldData) {
                    return {
                        ...oldData,
                        availableCopies: oldData.availableCopies - 1,
                    };
                }
                return oldData;
            });
        },
    })
}