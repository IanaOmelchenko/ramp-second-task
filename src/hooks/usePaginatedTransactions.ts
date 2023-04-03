import { useCallback, useState } from "react";
import {
  PaginatedRequestParams,
  PaginatedResponse,
  Transaction
} from "../utils/types";
import { PaginatedTransactionsResult } from "./types";
import { useCustomFetch } from "./useCustomFetch";

export function usePaginatedTransactions(): PaginatedTransactionsResult {
  // fix for bug 7 - full list
  const { fetchWithoutCache, loading } = useCustomFetch();
  const [
    paginatedTransactions,
    setPaginatedTransactions
  ] = useState<PaginatedResponse<Transaction[]> | null>(null);

  const fetchAll = useCallback(async () => {
    const response = await fetchWithoutCache<
      PaginatedResponse<Transaction[]>,
      PaginatedRequestParams
    >("paginatedTransactions", {
      page: paginatedTransactions === null ? 0 : paginatedTransactions.nextPage
    });

    setPaginatedTransactions((previousResponse) => {
      if (response === null || previousResponse === null) {
        return response;
      }

      return {
        // fix for bug 4
        data: [...previousResponse.data, ...response.data],
        nextPage: response.nextPage
      };
    });
  }, [fetchWithoutCache, paginatedTransactions]);

  const invalidateData = useCallback(() => {
    setPaginatedTransactions(null);
  }, []);

  return { data: paginatedTransactions, loading, fetchAll, invalidateData };
}
