import { SQLiteDatabase } from "expo-sqlite";

interface ProfileData {
  id: number;
  name: string;
  currency: string; // ISO 4217 currency code (e.g., USD, GBP, EUR)
}

const createProfileTable = async (db: SQLiteDatabase): Promise<void> => {
  const sql = `
    CREATE TABLE IF NOT EXISTS profiles (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      name TEXT NOT NULL,
      currency TEXT NOT NULL CHECK (LENGTH(currency) = 3)
    );
  `;
  await db.execAsync(sql);

  // Ensure there's always a row. If not, insert a default one.
  const countResult: { count: number } | null = await db.getFirstAsync(
    "SELECT COUNT(*) AS count FROM profiles;",
  );
  if (countResult && countResult.count === 0) {
    await insertDefaultUserData(db);
  }
};

const insertDefaultUserData = async (
  database: SQLiteDatabase,
): Promise<void> => {
  const sql = "INSERT INTO profiles (id, name, currency) VALUES (?, ?, ?);";
  await database.runAsync(sql, [1, "test", "GBP"]);
};

const saveProfileData = async (
  name: string,
  currency: string,
  db: SQLiteDatabase,
): Promise<void> => {
  const sql =
    "INSERT OR REPLACE INTO profiles (id, name, currency) VALUES (?, ?, ?);";
  await db.runAsync(sql, [1, name, currency]);
};

const getProfileData = async (
  db: SQLiteDatabase,
): Promise<ProfileData | undefined> => {
  const result: ProfileData | null = await db.getFirstAsync(
    "SELECT * FROM profiles WHERE id = 1;",
  );
  if (result) {
    return {
      id: result.id,
      name: result.name,
      currency: result.currency,
    } as ProfileData;
  }
  return undefined;
};

export { createProfileTable, getProfileData, saveProfileData, ProfileData };
