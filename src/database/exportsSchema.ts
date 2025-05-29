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
  } catch (error:any) {
    console.error("Error exporting data with joins:", error);
    throw new Error(`Failed to export data: ${error.message || 'Unknown error'}`);
    // return null;
  }
}
