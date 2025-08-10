import { SQLiteDatabase } from "expo-sqlite";

import { storeAsyncStorageData } from "@/utilities/async-storage";
import { ASYNC_STORAGE_KEYS, DEFAULT_USER_DATA } from "@/constants";

// const INSERT_DEFAULT_USER_DATA =
//   "INSERT INTO profiles (id, name, currency) VALUES (1, 'User', 'GBP');";

const INSERT_CATEGORY = `
  INSERT INTO categories (name, desc, icon, color )
  VALUES (?, ?, ?, ?);
`;

export async function migrateToVersion2(db: SQLiteDatabase) {
  const categoriesToInsert = [
    {
      name: "Housing",
      desc: "Household expenses",
      icon: "home",
      color: "hsl(0, 50%, 50%)",
    },
    {
      name: "Bills",
      desc: "Monthly bills",
      icon: "receipt-outline",
      color: "hsl(12, 100%, 50%)",
    },
    {
      name: "Clothes",
      desc: "Clothing expenses",
      icon: "hanger",
      color: "hsl(24, 100%, 50%)",
    },
    {
      name: "Entertainment",
      desc: "Entertainment and fun related expenses",
      icon: "game-controller",
      color: "hsl(36, 100%, 50%)",
    },
    {
      name: "Food",
      desc: "Dinning out expenses",
      icon: "food",
      color: "hsl(48, 100%, 50%)",
    },
    {
      name: "Gifts",
      desc: "Gifting expenses",
      icon: "gift",
      color: "hsl(60, 100%, 50%)",
    },
    {
      name: "Groceries",
      desc: "Everyday groceries expenses",
      icon: "cart",
      color: "hsl(72, 100%, 50%)",
    },
    {
      name: "Travel",
      desc: "Travel expenses",
      icon: "airplane",
      color: "hsl(84, 100%, 50%)",
    },
    {
      name: "Other",
      desc: "Other random expenses",
      icon: "cog",
      color: "hsl(96, 100%, 50%)",
    },
  ];

  return db.withTransactionAsync(async () => {
    // 1. insert user profile
    await storeAsyncStorageData(
      ASYNC_STORAGE_KEYS.USER_ACCOUNT,
      DEFAULT_USER_DATA,
    );

    // 2. insert default categories
    for (const category of categoriesToInsert) {
      await db.runAsync(INSERT_CATEGORY, [
        category.name,
        category.desc,
        category.icon,
        category.color,
      ]);
    }
  });
}
