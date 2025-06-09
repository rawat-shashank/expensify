import { SQLiteDatabase } from "expo-sqlite";
import { createAccountsTable } from "./accountsSchema";
import { createProfileTable } from "./profileSchema";
import { createCategoriesTable } from "./categoriesSchema";
import { createTransactionTable } from "./transactionSchema";

const initializeDatabase = async (db: SQLiteDatabase): Promise<void> => {
  try {
    await createAccountsTable(db);
    await createProfileTable(db);
    await createCategoriesTable(db);
    await createTransactionTable(db);
  } catch (error: any) {
    console.error("Error initializing database", error.message);
    throw error;
  }
};

const resetDatabase = async (db: SQLiteDatabase): Promise<void> => {
  await db.withTransactionAsync(async () => {
    // Drop existing table if it exists
    await db.execAsync("DROP TABLE IF EXISTS accounts;");
    await db.execAsync("DROP TABLE IF EXISTS transactions;");
    await db.execAsync("DROP TABLE IF EXISTS categories;");
  });
};

export { initializeDatabase, resetDatabase };
