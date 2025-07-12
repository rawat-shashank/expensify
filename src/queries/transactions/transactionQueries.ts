import {
  TransactionDetaillsType,
  TransactionType,
  getPaginatedTransactions as dbGetPaginatedTransactions,
  getTransactionById as dbGetTransactionById,
} from "@/database/transactionSchema";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { SQLiteDatabase } from "expo-sqlite";
import { transactionKeys } from "./transactionKeys";
import { PAGE_SIZE } from "@/constants";

/**
 * Hook to fetch paginated transactions.
 * @param db SQLiteDatabase instance.
 */
export const usePaginatedTransactions = (
  db: SQLiteDatabase,
  accountId?: number,
) => {
  return useInfiniteQuery<
    TransactionDetaillsType[],
    Error,
    { pageParam: number[]; pages: TransactionDetaillsType[] },
    ReturnType<typeof transactionKeys.listPaginated>,
    number
  >({
    queryKey: transactionKeys.listPaginated(accountId),
    queryFn: async ({ pageParam = 0 }) => {
      const offset = pageParam * PAGE_SIZE;
      return dbGetPaginatedTransactions(db, PAGE_SIZE, offset, accountId);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (lastPage.length < PAGE_SIZE) {
        return undefined;
      }
      return lastPageParam + 1;
    },
  });
};

export const useGetTransactionById = (
  db: SQLiteDatabase,
  transactionId: number,
) => {
  return useQuery<TransactionType | null, Error>({
    queryKey: transactionKeys.details(transactionId),
    queryFn: () => dbGetTransactionById(transactionId, db),
    enabled: !!transactionId,
  });
};
