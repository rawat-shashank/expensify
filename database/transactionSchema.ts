import { SQLiteDatabase } from "expo-sqlite";

interface TransactionType {
  id: number;
  title: string;
  amount: number;
  description: string;
  transaction_date: string;
  account_id: number;
  category_id: number;
  type: "expense" | "income" | "transfer";
}

const createTransactionTable = async (db: SQLiteDatabase): Promise<void> => {
  const sql = `
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      amount REAL NOT NULL,
      description TEXT,
      transaction_date TEXT NOT NULL,
      account_id INTEGER NOT NULL,
      category_id INTEGER NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('expense', 'income', 'transfer'))
    );
  `;
  await db.execAsync(sql);
};

const insertTransaction = async (
  title: string,
  amount: number,
  description: string,
  transaction_date: string,
  account_id: number,
  category_id: number,
  type: "expense" | "income" | "transfer",
  db: SQLiteDatabase,
): Promise<number> => {
  const result = await db.runAsync(
    "INSERT INTO transactions (title, amount, description, transaction_date, account_id, category_id, type) VALUES (?, ?, ?, ?, ?, ?, ?);",
    [
      title,
      amount,
      description,
      transaction_date,
      account_id,
      category_id,
      type,
    ],
  );
  return result.lastInsertRowId;
};

const getAllTransactions = async (
  db: SQLiteDatabase,
): Promise<TransactionType[]> => {
  const result = await db.getAllAsync(
    "SELECT * FROM transactions ORDER BY transaction_date DESC;",
  );
  return result as TransactionType[];
};

const getTransactionById = async (
  id: number,
  db: SQLiteDatabase,
): Promise<TransactionType | null> => {
  const result = await db.getFirstAsync(
    "SELECT * FROM transactions WHERE id = ?;",
    [id],
  );
  return result ? (result as TransactionType) : null;
};

const updateTransaction = async (
  transaction: TransactionType,
  db: SQLiteDatabase,
): Promise<boolean> => {
  const {
    id,
    title,
    amount,
    description,
    transaction_date,
    account_id,
    category_id,
    type,
  } = transaction;
  const result = await db.runAsync(
    "UPDATE transactions SET title = ?, amount = ?, description = ?, transaction_date = ?, account_id = ?, category_id = ?, type = ? WHERE id = ?;",
    [
      title,
      amount,
      description,
      transaction_date,
      account_id,
      category_id,
      type,
      id,
    ],
  );
  return result.changes > 0;
};

const deleteTransaction = async (
  id: number,
  db: SQLiteDatabase,
): Promise<boolean> => {
  const result = await db.runAsync("DELETE FROM transactions WHERE id = ?;", [
    id,
  ]);
  return result.changes > 0;
};

const getTransactionsByAccountId = async (
  id: number,
  db: SQLiteDatabase,
): Promise<TransactionType[] | null> => {
  const result = await db.getFirstAsync(
    "SELECT * FROM transactions WHERE account_id = ?;",
    [id],
  );
  return result ? (result as TransactionType[]) : null;
};

export {
  TransactionType,
  createTransactionTable,
  getAllTransactions,
  insertTransaction,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getTransactionsByAccountId,
};
