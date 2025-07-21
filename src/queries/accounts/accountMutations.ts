import { SQLiteDatabase } from "expo-sqlite";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { accountKeys } from "./accountKeys";
import {
  AccountType,
  insertAccount as dbInsertAccount,
  updateAccount as dbUpdateAccount,
  deleteAccount as dbDeleteAccount,
  CreateAccountType,
} from "@/database/accountsSchema";

export const useAddAccount = (db: SQLiteDatabase) => {
  const queryClient = useQueryClient();
  return useMutation<number | undefined, Error, CreateAccountType>({
    mutationFn: async (account) => {
      const success = await dbInsertAccount(account, db);
      return success;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.summaryList() });
    },
  });
};

export const useUpdateAccount = (db: SQLiteDatabase) => {
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, AccountType>({
    mutationFn: async (account) => {
      const success = await dbUpdateAccount(account, db);
      return success;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: accountKeys.summaryList() });
      queryClient.invalidateQueries({
        queryKey: accountKeys.details(variables.id!),
      });
    },
  });
};

export const useDeleteAccount = (db: SQLiteDatabase) => {
  const queryClient = useQueryClient();
  return useMutation<boolean | null, Error, number>({
    mutationFn: async (id) => {
      const success = await dbDeleteAccount(id, db);
      return success;
    },
    onSuccess: (_, deletedAccountId) => {
      queryClient.invalidateQueries({ queryKey: accountKeys.summaryList() });

      queryClient.invalidateQueries({
        queryKey: accountKeys.details(deletedAccountId),
      });
    },
  });
};
