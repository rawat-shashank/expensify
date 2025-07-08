import { SQLiteDatabase } from "expo-sqlite";
import { IconsName } from "@/components/Atoms/Icons";

// ---- Enums ----
enum TransactionTypeEnum {
  EXPENSE = "expense",
  INCOME = "income",
  TRANSFER = "transfer",
}

// ---- interfaces ----
interface CreateTransactionType {
  name: string;
  amount: string;
  desc: string;
  time: string;
  account_id: number; // foreign key
  category_id: number; // foreign key
  type: TransactionTypeEnum;
}

interface TransactionType extends CreateTransactionType {
  id: number;
}

interface TransactionDetaillsType extends TransactionType {
  account_name: string;
  category_name: string;
  category_color: string;
  category_icon: IconsName;
}

interface TransactionsGroupedByDate {
  [date: string]: {
    total_amount: number;
    transactions: TransactionDetaillsType[];
  };
}

// ---- SQL Queries ----

const SQL_CREATE_TRANSACTION_TABLE = `
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

const SQL_INSERT_TRANSACTION = `
  INSERT INTO transactions (name, amount, desc, time, account_id, category_id, type)
  VALUES (?, ?, ?, ?, ?, ?, ?);
`;

const SQL_GET_TRANSACTION_BY_ID = `
  SELECT * FROM transactions WHERE id = ?;
`;

const SQL_UPDATE_TRANSACTION = `
  UPDATE transactions
  SET name = ?, amount = ?, desc = ?, time = ?, account_id = ?, category_id = ?, type = ?
  WHERE id = ?;
`;

const SQL_DELETE_TRANSACTION = `
  DELETE FROM transactions WHERE id = ?;
`;

const SQL_GET_TRANSACTIONS_GROUPED_BY_DATE = `
  SELECT
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

// ---- Database Operations  ----

const createTransactionTable = async (db: SQLiteDatabase): Promise<void> => {
  await db.execAsync(SQL_CREATE_TRANSACTION_TABLE);
};

const insertTransaction = async (
  newTransaction: CreateTransactionType,
  db: SQLiteDatabase,
): Promise<number> => {
  const { name, amount, desc, time, account_id, category_id, type } =
    newTransaction;

  const result = await db.runAsync(SQL_INSERT_TRANSACTION, [
    name,
    amount,
    desc,
    time,
    account_id,
    category_id,
    type,
  ]);
  return result.lastInsertRowId;
};

const getAllTransactions = async (
  db: SQLiteDatabase,
  account_id?: number,
): Promise<TransactionDetaillsType[]> => {
  const params: (number | string)[] = [];
  let query = SQL_GET_TRANSACTIONS_GROUPED_BY_DATE;
  if (account_id !== undefined) {
    query += `WHERE t.account_id = ?`;
    params.push(account_id);
  }
  query += `ORDER BY t.time DESC`;

  const result = await db.getAllAsync(query, params);
  return result as TransactionDetaillsType[];
};

const getGroupedTransactionsByDate = async (
  db: SQLiteDatabase,
  account_id?: number,
): Promise<TransactionsGroupedByDate> => {
  const allTransactions = await getAllTransactions(db, account_id || undefined);
  const grouped: TransactionsGroupedByDate = {};

  for (const transaction of allTransactions) {
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

  const sortedGroupedOutput: TransactionsGroupedByDate = {};
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
  const result = await db.getFirstAsync(SQL_GET_TRANSACTION_BY_ID, [id]);
  return result ? (result as TransactionType) : null;
};

const updateTransaction = async (
  transaction: TransactionType,
  db: SQLiteDatabase,
): Promise<boolean> => {
  const { id, name, amount, desc, time, account_id, category_id, type } =
    transaction;
  const result = await db.runAsync(SQL_UPDATE_TRANSACTION, [
    name,
    amount,
    desc,
    time,
    account_id,
    category_id,
    type,
    id,
  ]);
  return result.changes > 0;
};

const deleteTransaction = async (
  id: number,
  db: SQLiteDatabase,
): Promise<boolean> => {
  const result = await db.runAsync(SQL_DELETE_TRANSACTION, [id]);
  return result.changes > 0;
};

export {
  TransactionTypeEnum,
  CreateTransactionType,
  TransactionType,
  TransactionDetaillsType,
  TransactionsGroupedByDate,
  createTransactionTable,
  getAllTransactions,
  insertTransaction,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getGroupedTransactionsByDate,
};
