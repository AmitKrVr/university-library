"use client"

import { ReactNode, useState } from "react"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./queryClient";
import config from "../config";

export const ReactQueryProvider = ({ children }: { children: ReactNode }) => {
    const [client] = useState(queryClient)

    return <QueryClientProvider client={client}>
        {children}
        {config.env.nodeENV === "development" && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
}
