import { SQLiteDatabase } from "expo-sqlite";

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

const SQL_CREATE_CATEGORIES_TABLE = `
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    desc TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL
  );
`;

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

export async function migrateToVersion1(db: SQLiteDatabase) {
  // 2. write on database
  return db.withTransactionAsync(async () => {
    await db.execAsync(SQL_CREATE_ACCOUNTS_TABLE);
    await db.execAsync(SQL_CREATE_CATEGORIES_TABLE);
    await db.execAsync(SQL_CREATE_TRANSACTION_TABLE);
  });
}
