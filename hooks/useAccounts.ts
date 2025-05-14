import { SQLiteDatabase } from "expo-sqlite";
import { useCallback, useEffect, useState } from "react";

import {
  AccountType,
  deleteAccount as dbDeleteAccount,
  getAccountById as dbGetAccountById,
  getAllAccounts as dbGetAllAccounts,
  insertAccount as dbInsertAccount,
  updateAccount as dbUpdateAccount,
} from "@/database/accountsSchema";

interface UseAccountsResult {
  accounts: AccountType[];
  loading: boolean;
  error: Error | null;
  fetchAccounts: () => Promise<void>;
  addAccount: (
    title: string,
    accountName: string,
    amount: number,
    defaultAccount: boolean,
    type: "cash" | "wallet" | "bank",
  ) => Promise<number | undefined>;
  getAccountById: (id: number) => Promise<AccountType | null>;
  deleteAccount: (id: number) => Promise<boolean | null>;
  updateAccount: (account: AccountType) => Promise<boolean | null>;
}

const useAccounts = (db: SQLiteDatabase): UseAccountsResult => {
  // TODO:check it once more to refactor this
  const [accounts, setAccounts] = useState<AccountType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedAccounts = await dbGetAllAccounts(db);
      setAccounts(fetchedAccounts);
      setError(null);
    } catch (err: any) {
      setError(err);
      setAccounts([]);
      console.error("Error fetching accounts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addAccount = useCallback(
    async (
      title: string,
      accountName: string,
      amount: number,
      defaultAccount: boolean,
      type: "cash" | "wallet" | "bank",
    ): Promise<number | undefined> => {
      try {
        setLoading(true);
        const newAccountId = await dbInsertAccount(
          title,
          accountName,
          amount,
          defaultAccount,
          type,
          db,
        );
        await fetchAccounts();
        return newAccountId;
      } catch (err: any) {
        setError(err);
        console.error("Error inserting account:", err);
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    [fetchAccounts],
  );

  const getAccountById = useCallback(
    async (id: number): Promise<AccountType | null> => {
      try {
        setLoading(true);
        const account = await dbGetAccountById(id, db);
        return account;
      } catch (err: any) {
        setError(err);
        console.error(`Error fetching account with ID ${id}:`, err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchAccounts],
  );

  const updateAccount = useCallback(
    async (account: AccountType): Promise<boolean> => {
      try {
        setLoading(true);
        const success = await dbUpdateAccount(account, db);
        if (success) {
          await fetchAccounts();
          return true;
        }
        return false;
      } catch (err: any) {
        setError(err);
        console.error(`Error updating account with ID ${account.id}:`, err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchAccounts],
  );

  const deleteAccount = useCallback(
    async (id: number): Promise<boolean | null> => {
      try {
        setLoading(true);
        const res = await dbDeleteAccount(id, db);
        if (res) {
          await fetchAccounts();
        }
        return res;
      } catch (err: any) {
        setError(err);
        console.error(`Error deleting account with ID ${id}:`, err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchAccounts],
  );

  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
        await fetchAccounts();
      } catch (err: any) {
        setError(err);
        console.error("Error fetching accounts data:", err);
      } finally {
        setLoading(false);
      }
    };
    initialize();
  }, [fetchAccounts]);

  return {
    accounts,
    loading,
    error,
    fetchAccounts,
    addAccount,
    getAccountById,
    deleteAccount,
    updateAccount,
  };
};

export default useAccounts;
