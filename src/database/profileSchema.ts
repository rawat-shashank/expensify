import { SQLiteDatabase } from "expo-sqlite";

interface ProfileData {
  id: number;
  name: string;
  currency: string; // ISO 4217 currency code (e.g., USD, GBP, EUR)
}

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

export { getProfileData, saveProfileData, ProfileData };
