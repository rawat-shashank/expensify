import { SQLiteDatabase } from "expo-sqlite";
import { AccountType, getAllAccounts } from "./accountsSchema";
import { CategoryType, getAllCategories } from "./categoriesSchema";
import { TransactionType } from "./transactionSchema";

// FIXME: this needs to be fixed as schema is changes a little
export interface BackupRestoreType {
  accounts: AccountType[];
  categories: CategoryType[];
  transactions: TransactionType[];
}

export async function exportAllDataToJson(
  db: SQLiteDatabase,
): Promise<BackupRestoreType> {
  try {
    const query = `
      SELECT
        t.*,
        a.accountName AS account_name,
        c.title AS category_title
      FROM
        transactions t
      JOIN
        accounts a ON t.account_id = a.id
      JOIN
        categories c ON t.category_id = c.id;
    `;
    const transactions = await db.getAllAsync<TransactionType>(query);
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
    // return null;
  }
}

export async function importAllDataFromJson(
  db: SQLiteDatabase,
  data: BackupRestoreType,
): Promise<void> {
  try {
    // Start a transaction for atomicity
    await db.withTransactionAsync(async () => {
      // 1. Clear existing data in reverse dependency order
      // Clear transactions first as they depend on accounts and categories
      await db.runAsync("DELETE FROM transactions;");
      await db.runAsync("DELETE FROM accounts;");
      await db.runAsync("DELETE FROM categories;");

      // 2. Insert new data
      // Insert categories
      for (const category of data.categories) {
        await db.runAsync(
          "INSERT INTO categories (id, title, desc) VALUES (?, ?, ?);",
          [category.id, category.title, category.desc],
        );
      }

      //      // Insert accounts
      for (const account of data.accounts) {
        await db.runAsync(
          "INSERT INTO accounts (id, title, accountName, amount, defaultAccount, type) VALUES (?, ?, ?, ?, ?, ? );",
          [
            account.id,
            account.title,
            account.accountName,
            account.amount,
            account.defaultAccount,
            account.type,
          ],
        );
      }

      // Insert transactions
      for (const transaction of data.transactions) {
        await db.runAsync(
          "INSERT INTO transactions (id, title, amount, description, transaction_date, account_id, category_id, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?);",
          [
            transaction.id,
            transaction.title,
            transaction.amount,
            transaction.description,
            transaction.transaction_date,
            transaction.account_id,
            transaction.category_id,
            transaction.type,
          ],
        );
      }
    });
  } catch (error: any) {
    console.error("Error importing data:", error);
    throw new Error(
      `Failed to import data: ${error.message || "Unknown error"}`,
    );
  }
}
