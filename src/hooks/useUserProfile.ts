"use client"

import { useQuery } from "@tanstack/react-query"
import { getUserProfile } from "@/lib/actions/getUserProfile"

export const useUserProfile = () => {
    return useQuery({
        queryKey: ["user-profile"],
        queryFn: async () => {
            return await getUserProfile()
        },
        staleTime: 10 * 60 * 1000,
    })
}
