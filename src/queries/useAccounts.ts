import { SQLiteDatabase } from "expo-sqlite";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  AccountSummaryType,
  AccountType,
  AddAccountType,
  deleteAccount as dbDeleteAccount,
  getAccountById as dbGetAccountById,
  getAllAccounts as dbGetAllAccounts,
  insertAccount as dbInsertAccount,
  updateAccount as dbUpdateAccount,
  getAccountIncomeExpenseSummary as dbGetAccountIncomeExpenseSummary,
} from "@/database/accountsSchema";

// Define a query key for accounts
export const accountKeys = {
  all: ["accounts"] as const,
  list: () => [...accountKeys.all, "list"] as const,
  listWithSummary: () => [...accountKeys.all, "withSummary"] as const,
  details: (id: number) => [...accountKeys.all, "details", id] as const,
};

const useAccounts = (db: SQLiteDatabase) => {
  const queryClient = useQueryClient();

  // Query to fetch all accounts
  const {
    data: accounts,
    isLoading: isLoadingAccounts,
    error: accountsError,
    refetch: refetchAccounts, // Expose refetch if you still need manual refetching
  } = useQuery<AccountType[], Error>({
    queryKey: accountKeys.list(),
    queryFn: () => dbGetAllAccounts(db),
  });

  const {
    data: accountsSummary,
    isLoading: isLoadingAccountsSummary,
    error: accountsSummaryError,
    refetch: refetchAccountsSummary,
  } = useQuery<AccountSummaryType[], Error>({
    queryKey: accountKeys.listWithSummary(),
    queryFn: () => dbGetAccountIncomeExpenseSummary(db),
  });

  // Mutation to add an account
  const {
    mutateAsync: addAccount,
    isPending: isAddingAccount,
    error: addAccountError,
  } = useMutation<number | undefined, Error, AddAccountType>({
    mutationFn: async (params) => {
      const newAccountId = await dbInsertAccount(params, db);
      return newAccountId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.list() });
    },
  });

  // Mutation to get account by ID (can also be a query if frequently needed standalone)
  // For simplicity and to show a mutation for a single item, we'll keep it as a mutation here.
  // If you often fetch a single account, consider it as a separate useQuery.
  const {
    mutateAsync: getAccountById,
    isPending: isGettingAccountById,
    error: getAccountByIdError,
  } = useMutation<AccountType | null, Error, number>({
    mutationFn: (id) => dbGetAccountById(id, db),
  });

  // Mutation to update an account
  const {
    mutateAsync: updateAccount,
    isPending: isUpdatingAccount,
    error: updateAccountError,
  } = useMutation<boolean, Error, AccountType>({
    mutationFn: async (account) => {
      const success = await dbUpdateAccount(account, db);
      return success;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: accountKeys.list() });
      queryClient.invalidateQueries({
        queryKey: accountKeys.details(variables.id!),
      });
    },
  });

  // Mutation to delete an account
  const {
    mutateAsync: deleteAccount,
    isPending: isDeletingAccount,
    error: deleteAccountError,
  } = useMutation<boolean | null, Error, number>({
    mutationFn: async (id) => {
      const success = await dbDeleteAccount(id, db);
      return success;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: accountKeys.list() });
      queryClient.invalidateQueries({
        queryKey: accountKeys.details(variables),
      });
    },
  });

  return {
    accounts: accounts || [],
    accountsSummary: accountsSummary || [],
    isLoading:
      isLoadingAccounts ||
      isAddingAccount ||
      isGettingAccountById ||
      isUpdatingAccount ||
      isDeletingAccount ||
      isLoadingAccountsSummary,
    error:
      accountsError ||
      addAccountError ||
      getAccountByIdError ||
      updateAccountError ||
      deleteAccountError ||
      accountsSummaryError,
    addAccount,
    getAccountById,
    updateAccount,
    deleteAccount,
    refetchAccounts,
    refetchAccountsSummary,
  };
};

export default useAccounts;
