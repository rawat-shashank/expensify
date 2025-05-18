import { SQLiteDatabase } from "expo-sqlite";
import { createAccountsTable } from "./accountsSchema";
import { createProfileTable } from "./profileSchema";
import { createCategoriesTable } from "./categoriesSchema";
import { createTransactionTable } from "./transactionSchema";

const initializeDatabase = async (db: SQLiteDatabase): Promise<void> => {
  try {
    await createProfileTable(db);
    await createAccountsTable(db);
    await createCategoriesTable(db);
    await createTransactionTable(db);
  } catch (error: any) {
    console.error("Error initializing database", error.message);
    throw error;
  }
};

export { initializeDatabase };
