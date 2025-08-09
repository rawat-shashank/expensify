import { SQLiteDatabase } from "expo-sqlite";
import { migrations, LATEST_DATABASE_VERSION } from "./migrations/";

const setupDatabase = async (db: SQLiteDatabase): Promise<void> => {
  try {
    const { user_version: currentVersion } = await db.getFirstAsync<any>(
      "PRAGMA user_version",
    );

    if (currentVersion < LATEST_DATABASE_VERSION) {
      console.log(
        `Migrating from version ${currentVersion} to ${LATEST_DATABASE_VERSION}...`,
      );

      for (let i = currentVersion; i < LATEST_DATABASE_VERSION; i++) {
        const migration = migrations[i];
        await migration(db);
      }

      await db.execAsync(`PRAGMA user_version = ${LATEST_DATABASE_VERSION};`);
    }

    console.log(`Database is up to date (version ${LATEST_DATABASE_VERSION}).`);
  } catch (error: any) {
    console.log(`Error setting up database: ${error.message}`);
    console.error("Database setup error:", error);
  }
};

const resetDatabase = async (db: SQLiteDatabase): Promise<void> => {
  await db.withTransactionAsync(async () => {
    // Drop existing table if it exists
    await db.execAsync("DROP TABLE IF EXISTS accounts;");
    await db.execAsync("DROP TABLE IF EXISTS transactions;");
    await db.execAsync("DROP TABLE IF EXISTS categories;");

    // Reset the auto-increment sequence for each table
    await db.execAsync("DELETE FROM sqlite_sequence WHERE name = 'accounts';");
    await db.execAsync(
      "DELETE FROM sqlite_sequence WHERE name = 'transactions';",
    );
    await db.execAsync(
      "DELETE FROM sqlite_sequence WHERE name = 'categories';",
    );

    await db.execAsync(`PRAGMA user_version = 0;`);
  });
};

export { setupDatabase, resetDatabase };
