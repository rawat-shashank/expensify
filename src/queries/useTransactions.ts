import { SQLiteDatabase } from "expo-sqlite";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  TransactionType,
  getAllTransactions as dbGetAllTransactions,
  insertTransaction as dbInsertTransaction,
  getTransactionById as dbGetTransactionById,
  updateTransaction as dbUpdateTransaction,
  deleteTransaction as dbDeleteTransaction,
  getTransactionsByAccountId as dbGetTransactionsByAccountId,
  AddTransactionType,
} from "@/database/transactionSchema";

export const transactionKeys = {
  all: ["transactions"] as const,
  lists: () => [...transactionKeys.all, "list"] as const,
  listsByAccount: (accountId: number) =>
    [...transactionKeys.all, "list", "byAccountId", accountId] as const,
  details: (id: number) => [...transactionKeys.all, "detail", id] as const,
};

export const useGetTransactionsByAccountId = (
  db: SQLiteDatabase,
  accountId: number,
) => {
  return useQuery<TransactionType[], Error>({
    queryKey: transactionKeys.listsByAccount(accountId!),
    queryFn: () => dbGetTransactionsByAccountId(accountId, db),
    enabled: accountId !== null,
  });
};

const useTransactions = (db: SQLiteDatabase) => {
  const queryClient = useQueryClient();

  // Query to fetch all transactions
  const {
    data: transactions,
    isLoading: isLoadingAllTransactions,
    error: allTransactionsError,
    refetch: refetchAllTransactions,
  } = useQuery<TransactionType[], Error>({
    queryKey: transactionKeys.lists(),
    queryFn: () => dbGetAllTransactions(db),
  });

  const {
    mutateAsync: getTransactionById,
    isPending: isGettingTransactionById,
    error: getTransactionByIdError,
  } = useMutation<TransactionType | null, Error, number>({
    mutationFn: (id) => dbGetTransactionById(id, db),
  });

  // Mutation to add a transaction
  const {
    mutateAsync: addTransaction,
    isPending: isAddingTransaction,
    error: addTransactionError,
  } = useMutation<number | undefined, Error, AddTransactionType>({
    mutationFn: async (params) => {
      const newTransactionId = await dbInsertTransaction(params, db);
      return newTransactionId;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: transactionKeys.listsByAccount(variables.account_id),
      });
    },
  });

  const {
    mutateAsync: updateTransaction,
    isPending: isUpdatingTransaction,
    error: updateTransactionError,
  } = useMutation<boolean, Error, TransactionType>({
    mutationFn: async (transaction) => {
      const success = await dbUpdateTransaction(transaction, db);
      return success;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: transactionKeys.details(variables.id!),
      });
      queryClient.invalidateQueries({
        queryKey: transactionKeys.listsByAccount(variables.account_id),
      });
    },
  });

  // Mutation to delete a transaction
  const {
    mutateAsync: deleteTransaction,
    isPending: isDeletingTransaction,
    error: deleteTransactionError,
  } = useMutation<boolean | null, Error, number>({
    mutationFn: async (id) => {
      const success = await dbDeleteTransaction(id, db);
      return success;
    },
    onSuccess: (_, deletedTransactionId) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: transactionKeys.details(deletedTransactionId),
      });
      queryClient.invalidateQueries({
        queryKey: [...transactionKeys.all, "list", "byAccountId"],
      });
    },
  });

  return {
    transactions: transactions || [],
    isLoading:
      isLoadingAllTransactions ||
      isGettingTransactionById ||
      isAddingTransaction ||
      isUpdatingTransaction ||
      isDeletingTransaction,
    error:
      allTransactionsError ||
      getTransactionByIdError ||
      addTransactionError ||
      updateTransactionError ||
      deleteTransactionError,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refetchAllTransactions,
    getTransactionById,
  };
};

export default useTransactions;
