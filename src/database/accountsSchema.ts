import { SQLiteDatabase } from "expo-sqlite";

enum AccountCardTypeEnum {
  CASH = "cash",
  WALLET = "wallet",
  BANK = "bank",
}

interface AddAccountType {
  name: string; //account holder's name
  accountName: string; //account name
  amount: string;
  cardType: AccountCardTypeEnum;
  color: string;
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
      amount TEXT NOT NULL,
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

export type AccountSummaryType = {
  id: number;
  name: string;
  accountName: string;
  amount: string;
  color: string;
  current_balance: number;
  cardType: AccountCardTypeEnum;
  type: "expense" | "income";
  total_income: number;
  total_expense: number;
};

const getAccountIncomeExpenseSummary = async (
  db: SQLiteDatabase,
): Promise<AccountSummaryType[]> => {
  const result = await db.getAllAsync(
    `SELECT
      a.id,
      a.name,
      a.accountName,
      a.cardType,
      a.amount,
      a.color,
      SUM(CASE WHEN t.type = 'income' THEN CAST(t.amount AS REAL) ELSE 0 END) AS total_income,
      SUM(CASE WHEN t.type = 'expense' THEN CAST(t.amount AS REAL) ELSE 0 END) AS total_expense,
      (CAST(a.amount AS REAL) +
         SUM(CASE WHEN t.type = 'income' THEN CAST(t.amount AS REAL) ELSE 0 END) -
         SUM(CASE WHEN t.type = 'expense' THEN CAST(t.amount AS REAL) ELSE 0 END)
      ) AS current_balance
    FROM
      accounts a
    LEFT JOIN
      transactions t ON a.id = t.account_id
    GROUP BY
      a.id,
      a.name,
      a.accountName
    ORDER BY
    a.id;`,
  );
  return result as AccountSummaryType[];
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
  AccountCardTypeEnum,
  AddAccountType,
  AccountType,
  createAccountsTable,
  insertAccount,
  getAllAccounts,
  getAccountById,
  deleteAccount,
  updateAccount,
  getAccountIncomeExpenseSummary,
};
