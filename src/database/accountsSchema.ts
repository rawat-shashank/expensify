import { SQLiteDatabase } from "expo-sqlite";

// ---- Types ----
enum AccountCardTypeEnum {
  CASH = "cash",
  WALLET = "wallet",
  BANK = "bank",
}

interface CreateAccountType {
  name: string; //account holder's name
  accountName: string; //account name
  amount: string;
  cardType: AccountCardTypeEnum;
  color: string;
  isActive?: boolean;
}

interface AccountType extends CreateAccountType {
  id: number;
}

interface AccountSummaryType extends AccountType {
  current_balance: number;
  total_income: number;
  total_expense: number;
}

// ---- SQL Queries ----

const SQL_CREATE_ACCOUNTS_TABLE = `
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

const SQL_GET_ALL_ACCOUNTS = `
  SELECT * FROM accounts;"
`;

const SQL_INSERT_ACCOUNT = `
  INSERT INTO accounts (name, accountName, amount, cardType, color, isActive)
  VALUES (?, ?, ?, ?, ?, ?);
`;

const SQL_GET_ACCOUNT_BY_ID = `
  SELECT id, name, accountName, amount, cardType, color, isActive FROM accounts WHERE id = ?;
`;

const SQL_UPDATE_ACCOUNT = `
  UPDATE accounts
  SET name = ?, accountName = ?, amount = ?, color = ?, cardType = ?, isActive = ?
  WHERE id = ?;
`;

const SQL_DELETE_ACCOUNT = `
  DELETE FROM accounts WHERE id = ?;
`;

const SQL_GET_ACCOUNT_SUMMARY_LIST = `
  SELECT
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
  a.id;
`;

// ---- Database Operations ----

/**
 * Creates the 'accounts' table for expo-sqlite, if table not exisits
 *  @param db SQLite database instance
 */
const createAccountsTable = async (db: SQLiteDatabase): Promise<void> => {
  await db.execAsync(SQL_CREATE_ACCOUNTS_TABLE);
};

/**
 * Retrieves all accounts from the database.
 * @param db The SQLite database instance.
 * @returns A promise that resolves to an array of Account objects.
 */
const getAllAccounts = async (db: SQLiteDatabase): Promise<AccountType[]> => {
  const result = await db.getAllAsync(SQL_GET_ALL_ACCOUNTS);
  return result as AccountType[];
};

/**
 * Inserts a new account into the database.
 * @param newAccount The data for the new account.
 * @param db The SQLite database instance.
 * @returns The ID of the newly inserted row.
 */ const insertAccount = async (
  newAccount: CreateAccountType,
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
  const result = await db.runAsync(SQL_INSERT_ACCOUNT, [
    name,
    accountName,
    amount,
    cardType,
    color,
    isActive ? 1 : 0,
  ]);
  return result.lastInsertRowId;
};

/**
 * Retrieves a summary of accounts including total income, total expense, and current balance.
 * This query joins with a 'transactions' table (assumed to exist).
 * @param db The SQLite database instance.
 * @returns A promise that resolves to an array of AccountSummary objects.
 */
const getAccountSummaryList = async (
  db: SQLiteDatabase,
): Promise<AccountSummaryType[]> => {
  const result = await db.getAllAsync(SQL_GET_ACCOUNT_SUMMARY_LIST);
  return result as AccountSummaryType[];
};

/**
 * Retrieves a single account by its ID from the database.
 * @param id The ID of the account to retrieve.
 * @param db The SQLite database instance.
 * @returns A promise that resolves to the Account object if found, otherwise null.
 */
const getAccountById = async (
  id: number,
  db: SQLiteDatabase,
): Promise<AccountType | null> => {
  const result = await db.getFirstAsync(SQL_GET_ACCOUNT_BY_ID, [id]);
  return result ? (result as AccountType) : null;
};

/**
 * Updates an existing account in the database.
 * @param account The Account object with updated data.
 * @param db The SQLite database instance.
 * @returns A promise that resolves to true if the account was updated, otherwise false.
 */
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
    isActive = true,
    id,
  } = account;
  const result = await db.runAsync(SQL_UPDATE_ACCOUNT, [
    name,
    accountName,
    amount,
    color,
    cardType,
    isActive ? 1 : 0,
    id,
  ]);
  return result.changes > 0;
};

/**
 * Deletes an account from the database by its ID.
 * @param id The ID of the account to delete.
 * @param db The SQLite database instance.
 * @returns A promise that resolves to true if the account was deleted, otherwise false.
 */
const deleteAccount = async (
  id: number,
  db: SQLiteDatabase,
): Promise<boolean> => {
  const result = await db.runAsync(SQL_DELETE_ACCOUNT, [id]);
  return result.changes > 0;
};

export {
  AccountCardTypeEnum,
  CreateAccountType,
  AccountType,
  AccountSummaryType,
  createAccountsTable,
  getAllAccounts,
  insertAccount,
  getAccountById,
  deleteAccount,
  updateAccount,
  getAccountSummaryList,
};
