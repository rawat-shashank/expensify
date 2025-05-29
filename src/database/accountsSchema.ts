import { SQLiteDatabase } from "expo-sqlite";

interface AddAccountType {
  title: string; //account holder's name
  accountName: string; //account name
  amount: number;
  defaultAccount: boolean;
  type: "cash" | "wallet" | "bank";
}

interface AccountType extends AddAccountType {
  id: number;
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
  newAccount: AddAccountType,
  db: SQLiteDatabase,
): Promise<number> => {
  const { title, accountName, amount, defaultAccount, type } = newAccount;
  const result = await db.runAsync(
    "INSERT INTO accounts (title, accountName, amount, defaultAccount, type) VALUES (?, ?, ?, ?, ?);",
    [title, accountName, amount, defaultAccount ? 1 : 0, type],
  );
  return result.lastInsertRowId;
};

const getAllAccounts = async (db: SQLiteDatabase): Promise<AccountType[]> => {
  const result = await db.getAllAsync("SELECT * FROM accounts;");
  return result as AccountType[];
};

const getAccountById = async (
  id: number,
  db: SQLiteDatabase,
): Promise<AccountType | null> => {
  const result = await db.getFirstAsync(
    "SELECT * FROM accounts WHERE id = ?;",
    [id],
  );
  return result ? (result as AccountType) : null;
};

const updateAccount = async (
  account: AccountType,
  db: SQLiteDatabase,
): Promise<boolean> => {
  const { title, accountName, amount, defaultAccount, type, id } = account;
  const result = await db.runAsync(
    "UPDATE accounts SET title = ?, accountName = ?, amount = ?, defaultAccount = ?, type = ? WHERE id = ?;",
    [title, accountName, amount, defaultAccount ? 1 : 0, type, id],
  );
  return result.changes > 0;
};

const deleteAccount = async (
  id: number,
  db: SQLiteDatabase,
): Promise<boolean> => {
  const result = await db.runAsync("DELETE FROM accounts WHERE id = ?;", [id]);
  return result.changes > 0;
};

export {
  AddAccountType,
  AccountType,
  createAccountsTable,
  insertAccount,
  getAllAccounts,
  getAccountById,
  deleteAccount,
  updateAccount,
};
