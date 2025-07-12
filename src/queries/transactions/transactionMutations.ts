import {
  CreateTransactionType,
  TransactionType,
  insertTransaction as dbInsertTransaction,
  updateTransaction as dbUpdateTransaction,
  deleteTransaction as dbDeleteTransaction,
} from "@/database/transactionSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SQLiteDatabase } from "expo-sqlite";
import { transactionKeys } from "./transactionKeys";

export const useAddTransaction = (db: SQLiteDatabase) => {
  const queryClient = useQueryClient();
  return useMutation<number | undefined, Error, CreateTransactionType>({
    mutationFn: async (params) => {
      const newTransactionId = await dbInsertTransaction(params, db);
      return newTransactionId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
    },
  });
};

export const useUpdateTransaction = (db: SQLiteDatabase) => {
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, TransactionType>({
    mutationFn: async (transaction) => {
      const success = await dbUpdateTransaction(transaction, db);
      return success;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: transactionKeys.details(variables.id!),
      });
    },
  });
};

export const useDeleteTransaction = (db: SQLiteDatabase) => {
  const queryClient = useQueryClient();
  return useMutation<boolean | null, Error, number>({
    mutationFn: async (id) => {
      const success = await dbDeleteTransaction(id, db);
      return success;
    },
    onSuccess: (_, deletedTransactionId) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });

      queryClient.invalidateQueries({
        queryKey: transactionKeys.details(deletedTransactionId),
      });
    },
  });
};
