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

// Import your database functions
import {
  createAccountsTable,
  insertAccount as dbInsertAccount,
  getAllAccounts as dbGetAllAccounts,
} from "@/database/accounts";

interface UseAccountsResult {
  accounts: Account[];
  loading: boolean;
  error: Error | null;
  createTable: () => Promise<void>;
  addAccount: (
    title: string,
    accountName: string,
    amount: number,
    defaultAccount: boolean,
    type: "cash" | "wallet" | "bank",
  ) => Promise<number | undefined>;
  fetchAccounts: () => Promise<void>;
}

const useAccounts = (db: SQLiteDatabase | null): UseAccountsResult => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const createTable = useCallback(async () => {
    if (!db) {
      console.warn("Database not initialized.");
      return;
    }
    try {
      setLoading(true);
      await createAccountsTable(db);
    } catch (err: any) {
      setError(err);
      console.error("Error creating accounts table:", err);
    } finally {
      setLoading(false);
    }
  }, [db]);

  const fetchAccounts = useCallback(async () => {
    if (!db) {
      console.warn("Database not initialized.");
      return;
    }
    try {
      setLoading(true);
      const fetchedAccounts = await dbGetAllAccounts(db);
      // Here you can perform data conversion or handling if needed
      setAccounts(fetchedAccounts);
      setError(null);
    } catch (err: any) {
      setError(err);
      setAccounts([]);
      console.error("Error fetching accounts:", err);
    } finally {
      setLoading(false);
    }
  }, [db]);

  const addAccount = useCallback(
    async (
      title: string,
      accountName: string,
      amount: number,
      defaultAccount: boolean,
      type: "cash" | "wallet" | "bank",
    ): Promise<number | undefined> => {
      if (!db) {
        console.warn("Database not initialized.");
        return undefined;
      }
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
        // Optionally, you can fetch accounts again to update the state
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
    [db, fetchAccounts],
  );

  // Optionally, you can fetch accounts when the component using this hook mounts
  useEffect(() => {
    if (db) {
      fetchAccounts();
    }
  }, [db, fetchAccounts]);

  return {
    accounts,
    loading,
    error,
    createTable,
    addAccount,
    fetchAccounts,
  };
};

export default useAccounts;
