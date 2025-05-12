import { QueryClient } from '@tanstack/react-query'
import config from '../config';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: config.env.nodeENV === "production",
            retry: 1,
        },
    },
});