import { SQLiteDatabase } from "expo-sqlite";
import {
  useGetAccountById,
  useGetAllAccountSummaryList,
} from "./accountQueries";
import {
  useAddAccount,
  useDeleteAccount,
  useUpdateAccount,
} from "./accountMutations";

/**
 * A comprehensive hook for managing categories, combining various query and mutation hooks.
 * @param db The SQLiteDatabase instance.
 * @param options Optional configuration, e.g., for fetching a specific category by ID.
 */
export const useAccounts = (
  db: SQLiteDatabase,
  options?: {
    accountId?: number;
  },
) => {
  // ---- Queries ----
  const {
    data: accountSummaryList,
    isLoading: isLoaindAccountSummaryList,
    error: accountSummaryListError,
    refetch: refetchAccountSummaryList,
  } = useGetAllAccountSummaryList(db);

  const {
    data: accountDetails,
    isLoading: isLoadingAccountDetails,
    error: accountDetailsError,
    refetch: refetchAccountDetails,
  } = useGetAccountById(db, options?.accountId as number);

  // ---- Mutations ----
  const {
    mutateAsync: addAccount,
    isPending: isAddingAccount,
    error: addAccountError,
  } = useAddAccount(db);

  const {
    mutateAsync: updateAccount,
    isPending: isUpdatingAccount,
    error: updateAccountError,
  } = useUpdateAccount(db);

  const {
    mutateAsync: deleteAccount,
    isPending: isDeletingAccount,
    error: deleteAccountError,
  } = useDeleteAccount(db);

  // Combine loading states for convenience
  const isLoading =
    isLoaindAccountSummaryList ||
    isLoadingAccountDetails ||
    isAddingAccount ||
    isUpdatingAccount ||
    isDeletingAccount;

  // Combine errors for convenience
  const error =
    accountSummaryListError ||
    accountDetailsError ||
    addAccountError ||
    updateAccountError ||
    deleteAccountError;

  return {
    // Data
    accountSummaryList: accountSummaryList || [],
    accountDetails: accountDetails || undefined,

    // Loading States
    isLoading,

    // Errors
    error,

    // Mutations
    addAccount,
    updateAccount,
    deleteAccount,

    // Refetch Functions
    refetchAccountSummaryList,
    refetchAccountDetails,
  };
};

export default useAccounts;
