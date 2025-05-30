import { SQLiteDatabase } from "expo-sqlite";
import { AccountType, getAllAccounts } from "./accountsSchema";
import { CategoryType, getAllCategories } from "./categoriesSchema";
import { TransactionType } from "./transactionSchema";

// Define a type for the joined data structure
interface ExportedTransaction extends TransactionType {
  account_name: string;
  category_title: string;
}

export interface BackupRestoreType {
  accounts: AccountType[];
  categories: CategoryType[];
  transactions: ExportedTransaction[];
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
    const transactions = await db.getAllAsync<ExportedTransaction>(query);
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
    });
  } catch (error: any) {
    console.error("Error importing data:", error);
    throw new Error(
      `Failed to import data: ${error.message || "Unknown error"}`,
    );
  }
}
//
//      // 2. Insert new data
//      // Insert categories
//      for (const category of data.categories) {
//        await db.runAsync(
//          "INSERT INTO categories (id, title, icon, type, color, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?);",
//          [
//            category.id,
//            category.title,
//            category.icon,
//            category.type,
//            category.color,
//            category.createdAt,
//            category.updatedAt,
//          ]
//        );
//      }
//
//      // Insert accounts
//      for (const account of data.accounts) {
//        await db.runAsync(
//          "INSERT INTO accounts (id, accountName, accountType, openingBalance, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?);",
//          [
//            account.id,
//            account.accountName,
//            account.accountType,
//            account.openingBalance,
//            account.createdAt,
//            account.updatedAt,
//          ]
//        );
//      }
//
//      // Insert transactions
//      // Note: We need to ensure that account_id and category_id from the exported data
//      // match the IDs in the newly inserted accounts and categories.
//      // Assuming the IDs are preserved from the original export, this should work.
//      for (const transaction of data.transactions) {
//      await db.runAsync(
//        "INSERT INTO transactions (id, account_id, category_id, amount, type, date, description, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);",
//        [
//          transaction.id,
//          transaction.account_id,
//          transaction.category_id,
//          transaction.amount,
//          transaction.type,
//          transaction.date,
//          transaction.description,
//          transaction.createdAt,
//          transaction.updatedAt,
//        ]
//      );
//    }
//  });
//
//  console.log("Data imported successfully!");
//} catch (error: any) {
//  console.error("Error importing data:", error);
//  throw new Error(`Failed to import data: ${error.message || 'Unknown error'}`);
//}
//}
