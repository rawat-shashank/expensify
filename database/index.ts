import { SQLiteDatabase } from "expo-sqlite";
import { createAccountsTable } from "./accounts";
import { createProfileTable } from "./profileSchema";

const initializeDatabase = async (db: SQLiteDatabase): Promise<void> => {
  try {
    await createAccountsTable(db);
    await createProfileTable(db);
  } catch (error: any) {
    console.error("Error initializing database", error.message);
    throw error;
  }
};

export { initializeDatabase };
