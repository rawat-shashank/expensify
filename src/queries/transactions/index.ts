import { SQLiteDatabase } from "expo-sqlite";
import {
  useGetTransactionById,
  usePaginatedTransactions,
} from "./transactionQueries";
import {
  useAddTransaction,
  useDeleteTransaction,
  useUpdateTransaction,
} from "./transactionMutations";

const useTransactions = (
  db: SQLiteDatabase,
  options?: {
    accountId?: number;
    transactionId?: number;
  },
) => {
  // ---- Queries ----
  const {
    data: paginatedTransactions,
    isLoading: isLoadingPaginatedTransactions,
    error: paginatedTransactionsError,
    fetchNextPage,
    hasNextPage,
    refetch: refetchPaginatedTransactions,
  } = usePaginatedTransactions(db, options?.accountId);

  const transactions =
    paginatedTransactions?.pages.flatMap((page) => page) || [];

  const {
    data: transaction,
    isLoading: isLoadingTransactionDetails,
    error: transactionDetailsError,
    refetch: refetchTransactionDetails,
  } = useGetTransactionById(db, options?.transactionId as number);

  // ---- Mutations ----
  const {
    mutateAsync: addTransaction,
    isPending: isAddingTransaction,
    error: addTransactionError,
  } = useAddTransaction(db);

  const {
    mutateAsync: updateTransaction,
    isPending: isUpdatingTransaction,
    error: updateTransactionError,
  } = useUpdateTransaction(db);

  const {
    mutateAsync: deleteTransaction,
    isPending: isDeletingTransaction,
    error: deleteTransactionError,
  } = useDeleteTransaction(db);

  const isPending =
    isLoadingPaginatedTransactions ||
    isLoadingTransactionDetails ||
    isAddingTransaction ||
    isUpdatingTransaction ||
    isDeletingTransaction;

  const error =
    paginatedTransactionsError ||
    transactionDetailsError ||
    addTransactionError ||
    updateTransactionError ||
    deleteTransactionError;

  return {
    // Data
    transactions,
    transaction,

    // Loading
    isPending,

    // Errors
    error,

    // Mutations
    addTransaction,
    updateTransaction,
    deleteTransaction,

    // refetch functions
    refetchPaginatedTransactions,
    refetchTransactionDetails,

    // Infinite query options
    fetchNextPage,
    hasNextPage,
  };
};

export default useTransactions;
