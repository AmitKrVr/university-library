export const getBooksCacheKey = (query: string, page: number) => {
    return `books:${query || "all"}:page-${page}`;
};

export const getBooksCountCacheKey = (query: string) => {
    return `books-count:${query || "all"}`;
};
