import { SQLiteDatabase } from "expo-sqlite";

interface AddAccountType {
  name: string; //account holder's name
  accountName: string; //account name
  amount: number;
  cardType: "cash" | "wallet" | "bank";
  color?: string;
}

interface AccountType extends AddAccountType {
  id: number;
}

const createAccountsTable = async (db: SQLiteDatabase): Promise<void> => {
  const sql = `
    CREATE TABLE IF NOT EXISTS accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      accountName TEXT NOT NULL,
      amount REAL NOT NULL,
      cardType TEXT NOT NULL CHECK (cardType IN ('cash', 'wallet', 'bank')),
      color TEXT NOT NULL
    );
  `;
  await db.execAsync(sql);
};

const insertAccount = async (
  newAccount: AddAccountType,
  db: SQLiteDatabase,
): Promise<number> => {
  const { name, accountName, amount, cardType, color = "" } = newAccount;
  const result = await db.runAsync(
    "INSERT INTO accounts (name, accountName, amount, cardType, color) VALUES (?, ?, ?, ?, ?);",
    [name, accountName, amount, cardType, color],
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
  const { name, accountName, amount, cardType, color = "", id } = account;
  const result = await db.runAsync(
    "UPDATE accounts SET name = ?, accountName = ?, amount = ?, color = ?, cardType = ? WHERE id = ?;",
    [name, accountName, amount, color, cardType, id],
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
