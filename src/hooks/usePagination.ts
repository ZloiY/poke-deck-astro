import { useCallback, useEffect, useMemo, useState } from "react";

type PaginationReturn = {
    currentPageParams: { limit: number; offset: number };
    nextPageParams: { limit: number; offset: number } | null;
    prevPageParams: { limit: number; offset: number } | null;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    currentPage: number;
    goToNextPage: () => void;
    goToPrevPage: () => void;
    paginationState: PaginationState;
};

type PaginationParams = {
    page: number;
    limit: number;
    totalLength: number;
    onNextPage: (nextPage: number) => void;
    onPrevPage: (prevPage: number) => void;
};

const calcOffset = (page: number, limit: number) => page * limit;

export const usePagination = ({
    page,
    limit,
    totalLength,
    onNextPage,
    onPrevPage,
}: PaginationParams): PaginationReturn => {
    const initialPage = page;
    const [paginationState, setPaginationState] =
        useState<PaginationState>("Initial");
    const totalPages = Math.ceil(totalLength / limit);
    if (initialPage > totalPages || initialPage < 0) {
        throw new Error("Wrong page");
    }
    const hasNextPage = initialPage < totalPages;
    const hasPrevPage = initialPage > 0;

    useEffect(() => {
        setPaginationState("Initial");
    }, []);

    const goToNextPage = useCallback(() => {
        if (hasNextPage) {
            setPaginationState("Next");
            onNextPage(page + 1);
        }
    }, [hasNextPage, page]);

    const goToPrevPage = useCallback(() => {
        if (hasPrevPage) {
            setPaginationState("Prev");
            onPrevPage(page - 1);
        }
    }, [hasPrevPage, page]);

    return useMemo(
        () => ({
            currentPageParams: { limit, offset: calcOffset(page, limit) },
            nextPageParams: hasNextPage
                ? { limit, offset: calcOffset(page + 1, limit) }
                : null,
            prevPageParams: hasPrevPage
                ? { limit, offset: calcOffset(page - 1, limit) }
                : null,
            hasNextPage,
            hasPrevPage,
            currentPage: page,
            goToNextPage,
            goToPrevPage,
            paginationState,
        }),
        [
            hasNextPage,
            paginationState,
            hasPrevPage,
            goToNextPage,
            goToPrevPage,
            limit,
            page,
        ],
    );
};
