import { SQLiteDatabase } from "expo-sqlite";
import { AccountType, getAllAccounts } from "./accountsSchema";
import { CategoryType, getAllCategories } from "./categoriesSchema";
import { TransactionType } from "./transactionSchema";

// ---- SQL Quries ----

const SQL_TRANSACTION_BACKUP = `
  SELECT
    t.*,
    a.accountName AS account_name,
    c.name AS category_title
  FROM
    transactions t
  JOIN
    accounts a ON t.account_id = a.id
  JOIN
    categories c ON t.category_id = c.id;
`;

const SQL_INSERT_CATEGORY = `
  INSERT INTO categories (id, name, desc, icon, color ) VALUES (?, ?, ?, ?, ?);
`;
const SQL_INSERT_ACCOUNT = `
  INSERT INTO accounts (id, name, accountName, amount, cardType, color, isActive)
  VALUES (?, ?, ?, ?, ?, ?, ?);
`;

const SQL_INSERT_TRANSACTION = `
  INSERT INTO transactions (id, name, amount, desc, time, account_id, category_id, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?);,
`;

const SQL_DELETE_CATEGORIES = `DELETE FROM categories;`;
const SQL_DELETE_ACCOUNTS = `DELETE FROM accounts;`;
const SQL_DELETE_TRANSACTIONS = `DELETE FROM transactions;`;

// ---- interface ----

export interface BackupRestoreType {
  accounts: AccountType[];
  categories: CategoryType[];
  transactions: TransactionType[];
}

/**
 * Exports all data (accounts, categories, and transactions) from the database into a JSON-compatible object.
 * The transactions are exported in their raw form, suitable for re-import.
 * @param db The SQLite database instance.
 * @returns A promise that resolves to an object containing all database data.
 * @throws An error if data export fails.
 */
export async function exportAllDataToJson(
  db: SQLiteDatabase,
): Promise<BackupRestoreType> {
  try {
    const transactions = await db.getAllAsync<TransactionType>(
      SQL_TRANSACTION_BACKUP,
    );
    const accounts = await getAllAccounts(db);
    const categories = await getAllCategories(db);
    return {
      accounts,
      categories,
      transactions,
    };
  } catch (error: any) {
    console.error("Error exporting data with joins:", error);
    throw new Error(
      `Failed to export data: ${error.message || "Unknown error"}`,
    );
  }
}

/**
 * Imports data into the database from a BackupRestoreData object.
 * This process clears existing data in the tables (transactions, accounts, categories)
 * and then inserts the provided data in the correct dependency order.
 * @param db The SQLite database instance.
 * @param data The object containing accounts, categories, and transactions to import.
 * @throws An error if data import fails.
 */
export async function importAllDataFromJson(
  db: SQLiteDatabase,
  data: BackupRestoreType,
): Promise<void> {
  try {
    // Start a transaction for atomicity
    await db.withTransactionAsync(async () => {
      // 1. Clear existing data in reverse dependency order
      // Clear transactions first as they depend on accounts and categories
      await db.runAsync(SQL_DELETE_TRANSACTIONS);
      await db.runAsync(SQL_DELETE_ACCOUNTS);
      await db.runAsync(SQL_DELETE_CATEGORIES);

      // 2. Insert new data

      // Insert categories
      for (const category of data.categories) {
        const { id, name, desc, icon, color } = category;
        await db.runAsync(SQL_INSERT_CATEGORY, [id, name, desc, icon, color]);
      }

      // Insert accounts
      for (const account of data.accounts) {
        await db.runAsync(SQL_INSERT_ACCOUNT, [
          account.id,
          account.name,
          account.accountName,
          account.amount,
          account.cardType,
          account.color,
          account.isActive ? 1 : 0,
        ]);
      }

      // Insert transactions
      for (const transaction of data.transactions) {
        await db.runAsync(SQL_INSERT_TRANSACTION, [
          transaction.id,
          transaction.name,
          transaction.amount,
          transaction.desc,
          transaction.time,
          transaction.account_id,
          transaction.category_id,
          transaction.type,
        ]);
      }
    });
  } catch (error: any) {
    console.error("Error importing data:", error);
    throw new Error(
      `Failed to import data: ${error.message || "Unknown error"}`,
    );
  }
}
