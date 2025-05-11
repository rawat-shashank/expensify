import { useState, useEffect, useCallback } from "react";
import { SQLiteDatabase } from "expo-sqlite";

interface Account {
  id: number;
  title: string;
  accountName: string;
  amount: number;
  defaultAccount: boolean;
  type: "cash" | "wallet" | "bank";
}

import {
  insertAccount as dbInsertAccount,
  getAllAccounts as dbGetAllAccounts,
  getAccountById as dbGetAccountById,
  deleteAccount as dbDeleteAccount,
  updateAccount as dbUpdateAccount,
} from "@/database/accounts";

interface UseAccountsResult {
  accounts: Account[];
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
  getAccountById: (id: number) => Promise<Account | null>;
  deleteAccount: (id: number) => Promise<boolean | null>;
  updateAccount: (account: Account) => Promise<boolean | null>;
}

const useAccounts = (db: SQLiteDatabase): UseAccountsResult => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedAccounts = await dbGetAllAccounts(db);
      // @FIX: data is not updating on page load
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
    async (id: number): Promise<Account | null> => {
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
    [db],
  );

  const updateAccount = useCallback(
    async (account: Account): Promise<boolean> => {
      try {
        setLoading(true);
        const success = await dbUpdateAccount(account, db);
        if (success) {
          await fetchAccounts(); // Refresh the list after update
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
    [db, fetchAccounts],
  );
  const deleteAccount = useCallback(
    async (id: number): Promise<boolean | null> => {
      try {
        setLoading(true);
        const res = await dbDeleteAccount(id, db);
        return res;
      } catch (err: any) {
        setError(err);
        console.error(`Error deleting account with ID ${id}:`, err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [db],
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
