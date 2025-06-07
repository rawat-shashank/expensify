import { SQLiteDatabase } from "expo-sqlite";

enum AccountCardType {
  CASH = "cash",
  WALLET = "wallet",
  BANK = "bank",
}

interface AddAccountType {
  name: string; //account holder's name
  accountName: string; //account name
  amount: number;
  cardType: AccountCardType;
  color?: string;
  isActive?: boolean;
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
      color TEXT NOT NULL,
      isActive INTEGER DEFAULT 1 NOT NULL
    );
  `;
  await db.execAsync(sql);
};

const insertAccount = async (
  newAccount: AddAccountType,
  db: SQLiteDatabase,
): Promise<number> => {
  const {
    name,
    accountName,
    amount,
    cardType,
    color = "",
    isActive = true,
  } = newAccount;
  const result = await db.runAsync(
    "INSERT INTO accounts (name, accountName, amount, cardType, color, isActive) VALUES (?, ?, ?, ?, ?, ?);",
    [name, accountName, amount, cardType, color, isActive ? 1 : 0],
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
  const {
    name,
    accountName,
    amount,
    cardType,
    color = "",
    isActive = false,
    id,
  } = account;
  const result = await db.runAsync(
    "UPDATE accounts SET name = ?, accountName = ?, amount = ?, color = ?, cardType = ?, isActive = ? WHERE id = ?;",
    [name, accountName, amount, color, cardType, isActive ? 1 : 0, id],
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
  AccountCardType,
  AddAccountType,
  AccountType,
  createAccountsTable,
  insertAccount,
  getAllAccounts,
  getAccountById,
  deleteAccount,
  updateAccount,
};
