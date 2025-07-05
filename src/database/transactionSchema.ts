import { SQLiteDatabase } from "expo-sqlite";
import { IconsName } from "@/components/Atoms/Icons";

enum TransactionTypeEnum {
  EXPENSE = "expense",
  INCOME = "income",
  TRANSFER = "transfer",
}

interface AddTransactionType {
  name: string;
  amount: string;
  desc: string;
  time: string;
  account_id: number; // foreign key
  category_id: number; // foreign key
  type: TransactionTypeEnum;
}

interface TransactionType extends AddTransactionType {
  id: number;
}

interface TransactionTypeExtra extends TransactionType {
  account_name: string;
  category_name: string;
  category_color: string;
  category_icon: IconsName;
}

const createTransactionTable = async (db: SQLiteDatabase): Promise<void> => {
  const sql = `
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      desc TEXT,
      amount TEXT NOT NULL,
      time TEXT NOT NULL,
      account_id INTEGER NOT NULL,
      category_id INTEGER NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('expense', 'income', 'transfer'))
    );
  `;
  await db.execAsync(sql);
};

const insertTransaction = async (
  newTransaction: AddTransactionType,
  db: SQLiteDatabase,
): Promise<number> => {
  const { name, amount, desc, time, account_id, category_id, type } =
    newTransaction;

  const result = await db.runAsync(
    "INSERT INTO transactions (name, amount, desc, time, account_id, category_id, type) VALUES (?, ?, ?, ?, ?, ?, ?);",
    [name, amount, desc, time, account_id, category_id, type],
  );
  return result.lastInsertRowId;
};

//const getAllTransactions = async (
//  db: SQLiteDatabase,
//): Promise<TransactionType[]> => {
//  const result = await db.getAllAsync(
//    "SELECT * FROM transactions ORDER BY time DESC",
//  );
//  return result as TransactionType[];
//};

const getAllTransactions = async (
  db: SQLiteDatabase,
  account_id?: number,
): Promise<TransactionTypeExtra[]> => {
  const params: (number | string)[] = [];
  let query = `SELECT
      t.*,
      a.accountName AS account_name,
      c.name AS category_name,
      c.icon AS category_icon,
      c.color AS category_color
    FROM
      transactions t
    JOIN
      accounts a ON t.account_id = a.id
    JOIN
      categories c ON t.category_id = c.id
      `;
  if (account_id !== undefined) {
    query += `WHERE t.account_id = ?`;
    params.push(account_id);
  }
  query += `ORDER BY t.time DESC`;

  const result = await db.getAllAsync(query, params);
  return result as TransactionTypeExtra[];
};

export interface TransactionGroupedByDate {
  [date: string]: {
    total_amount: number;
    transactions: TransactionTypeExtra[];
  };
}

const getGroupedTransactionsByDate = async (
  db: SQLiteDatabase,
  account_id?: number,
): Promise<TransactionGroupedByDate> => {
  const allTransactions = await getAllTransactions(db, account_id || undefined);
  const grouped: TransactionGroupedByDate = {};

  for (const transaction of allTransactions) {
    // Assuming t.time is a string like 'YYYY-MM-DD HH:MM:SS' or a Date object that can be formatted
    const transactionDate = new Date(transaction.time)
      .toISOString()
      .split("T")[0];

    if (!grouped[transactionDate]) {
      grouped[transactionDate] = {
        total_amount: 0,
        transactions: [],
      };
    }

    grouped[transactionDate].total_amount +=
      transaction.type === TransactionTypeEnum.INCOME
        ? parseFloat(transaction.amount)
        : -1 * parseFloat(transaction.amount);
    grouped[transactionDate].transactions.push(transaction);
  }

  const sortedGroupedOutput: TransactionGroupedByDate = {};
  Object.keys(grouped)
    .sort((a, b) => b.localeCompare(a))
    .forEach((key) => {
      sortedGroupedOutput[key] = grouped[key];
    });

  return sortedGroupedOutput;
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
  const { id, name, amount, desc, time, account_id, category_id, type } =
    transaction;
  const result = await db.runAsync(
    "UPDATE transactions SET name = ?, amount = ?, desc = ?, time = ?, account_id = ?, category_id = ?, type = ? WHERE id = ?;",
    [name, amount, desc, time, account_id, category_id, type, id],
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
): Promise<TransactionType[]> => {
  const result = await db.getFirstAsync(
    "SELECT * FROM transactions WHERE account_id = ?;",
    [id],
  );
  return result ? (result as TransactionType[]) : [];
};

export {
  TransactionTypeEnum,
  AddTransactionType,
  TransactionType,
  TransactionTypeExtra,
  createTransactionTable,
  getAllTransactions,
  insertTransaction,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getTransactionsByAccountId,
  getGroupedTransactionsByDate,
};
