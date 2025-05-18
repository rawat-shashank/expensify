import { SQLiteDatabase } from "expo-sqlite";
import { useCallback, useEffect, useState } from "react";

import {
  TransactionType,
  getAllTransactions as dbGetAllTransactions,
  insertTransaction as dbInsertTransaction,
  getTransactionById as dbGetTransactionById,
  updateTransaction as dbUpdateTransaction,
  deleteTransaction as dbDeleteTransaction,
} from "@/database/transactionSchema";

interface useTransactionsResult {
  transactions: TransactionType[];
  loading: boolean;
  error: Error | null;
  fetchTransactions: () => Promise<void>;
  addTransaction: (
    title: string,
    amount: number,
    description: string,
    transaction_date: string,
    account_id: number,
    category_id: number,
    type: "expense" | "income" | "transfer",
  ) => Promise<number | undefined>;
  getTransactionById: (id: number) => Promise<TransactionType | null>;
  deleteTransaction: (id: number) => Promise<boolean | null>;
  updateTransaction: (account: TransactionType) => Promise<boolean | null>;
}

const useTransactions = (db: SQLiteDatabase): useTransactionsResult => {
  // TODO:check it once more to refactor this
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedTransactions = await dbGetAllTransactions(db);
      setTransactions(fetchedTransactions);
      setError(null);
    } catch (err: any) {
      setError(err);
      setTransactions([]);
      console.error("Error fetching accounts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addTransaction = useCallback(
    async (
      title: string,
      amount: number,
      description: string,
      date: string,
      account_id: number,
      category_id: number,
      type: "expense" | "income" | "transfer",
    ): Promise<number | undefined> => {
      try {
        setLoading(true);
        const newTransactionId = await dbInsertTransaction(
          title,
          amount,
          description,
          date,
          account_id,
          category_id,
          type,
          db,
        );
        await fetchTransactions();
        return newTransactionId;
      } catch (err: any) {
        setError(err);
        console.error("Error inserting account:", err);
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    [fetchTransactions],
  );

  const getTransactionById = useCallback(
    async (id: number): Promise<TransactionType | null> => {
      try {
        setLoading(true);
        const transaction = await dbGetTransactionById(id, db);
        return transaction;
      } catch (err: any) {
        setError(err);
        console.error(`Error fetching account with ID ${id}:`, err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchTransactions],
  );

  const updateTransaction = useCallback(
    async (transaction: TransactionType): Promise<boolean> => {
      try {
        setLoading(true);
        const success = await dbUpdateTransaction(transaction, db);
        if (success) {
          await fetchTransactions();
          return true;
        }
        return false;
      } catch (err: any) {
        setError(err);
        console.error(`Error updating account with ID ${transaction.id}:`, err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchTransactions],
  );

  const deleteTransaction = useCallback(
    async (id: number): Promise<boolean | null> => {
      try {
        setLoading(true);
        const res = await dbDeleteTransaction(id, db);
        if (res) {
          await fetchTransactions();
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
    [fetchTransactions],
  );

  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
        await fetchTransactions();
      } catch (err: any) {
        setError(err);
        console.error("Error fetching accounts data:", err);
      } finally {
        setLoading(false);
      }
    };
    initialize();
  }, [fetchTransactions]);

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    addTransaction,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
  };
};

export default useTransactions;
