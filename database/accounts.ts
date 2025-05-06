import { SQLiteDatabase } from "expo-sqlite";

interface Account {
  id: number;
  title: string;
  accountName: string;
  amount: number;
  defaultAccount: boolean;
  type: "cash" | "wallet" | "bank";
}

const createAccountsTable = async (db: SQLiteDatabase): Promise<void> => {
  const sql = `
    CREATE TABLE IF NOT EXISTS accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      accountName TEXT NOT NULL,
      amount REAL NOT NULL,
      defaultAccount INTEGER NOT NULL DEFAULT 0 CHECK (defaultAccount IN (0, 1)),
      type TEXT NOT NULL CHECK (type IN ('cash', 'wallet', 'bank'))
    );
  `;
  await db.execAsync(sql);
};

const insertAccount = async (
  title: string,
  accountName: string,
  amount: number,
  defaultAccount: boolean,
  type: "cash" | "wallet" | "bank",
  db: SQLiteDatabase,
): Promise<number> => {
  const result = await db.runAsync(
    "INSERT INTO accounts (title, accountName, amount, defaultAccount, type) VALUES (?, ?, ?, ?, ?);",
    [title, accountName, amount, defaultAccount ? 1 : 0, type],
  );
  return result.lastInsertRowId;
};

const getAllAccounts = async (db: SQLiteDatabase): Promise<Account[]> => {
  const result = await db.getAllAsync("SELECT * FROM accounts;");
  return result as Account[];
};

//const getAccountById = async (id: number): Promise<Account | null> => {
//  const result = await db.runAsync("SELECT * FROM accounts WHERE id = ?;", [
//    id,
//  ]);
//  return result
//    ? (result[0].rows._array[0] as Account)
//    : null;
//};
//
//const updateAccount = async (
//  id: number,
//  title: string,
//  accountName: string,
//  amount: number,
//  defaultAccount: boolean,
//  type: "cash" | "wallet" | "bank",
//): Promise<boolean> => {
//  const result = await db.execAsync(
//    "UPDATE accounts SET title = ?, accountName = ?, amount = ?, defaultAccount = ?, type = ? WHERE id = ?;",
//    [title, accountName, amount, defaultAccount ? 1 : 0, type, id],
//  );
//  return result[0].rowsAffected > 0;
//};
//
//const deleteAccount = async (id: number): Promise<boolean> => {
//  const result = await db.execAsync("DELETE FROM accounts WHERE id = ?;", [id]);
//  return result[0].rowsAffected > 0;
//};

export { createAccountsTable, insertAccount, getAllAccounts, Account };
