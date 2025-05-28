export const getBooksCacheKey = (query: string, page: number) => {
    return `books:${query || "all"}:page-${page}`;
};

export const getBooksCountCacheKey = (query: string) => {
    return `books-count:${query || "all"}`;
};

export const borrowCountKey = 'dashboard:borrowCount';
export const userCountKey = 'dashboard:userCount';
export const bookCountKey = 'dashboard:bookCount';