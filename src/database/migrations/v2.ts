import { SQLiteDatabase } from "expo-sqlite";

const INSERT_DEFAULT_USER_DATA =
  "INSERT INTO profiles (id, name, currency) VALUES (1, 'User', 'GBP');";

const INSERT_CATEGORY = `
  INSERT INTO categories (name, desc, icon, color )
  VALUES (?, ?, ?, ?);
`;

export async function migrateToVersion2(db: SQLiteDatabase) {
  const categoriesToInsert = [
    {
      name: "Bills",
      desc: "",
      icon: "receipt-outline",
      color: "hsl(12, 100%, 50%)",
    },
    { name: "Clothes", desc: "", icon: "hanger", color: "hsl(24, 100%, 50%)" },
    {
      name: "Entertainment",
      desc: "",
      icon: "game-controller",
      color: "hsl(36, 100%, 50%)",
    },
    { name: "Food", desc: "", icon: "food", color: "hsl(48, 100%, 50%)" },
    { name: "Gifts", desc: "", icon: "gift", color: "hsl(60, 100%, 50%)" },
    { name: "Groceries", desc: "", icon: "cart", color: "hsl(72, 100%, 50%)" },
    { name: "Travel", desc: "", icon: "airplane", color: "hsl(84, 100%, 50%)" },
    { name: "Other", desc: "", icon: "cog", color: "hsl(96, 100%, 50%)" },
  ];

  return db.withTransactionAsync(async () => {
    // 1. insert user profile
    await db.runAsync(INSERT_DEFAULT_USER_DATA);

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
