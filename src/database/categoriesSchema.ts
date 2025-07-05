import { IconsName } from "@/components/Atoms/Icons";
import { SQLiteDatabase } from "expo-sqlite";

interface AddCategoryType {
  name: string;
  desc: string;
  icon: IconsName;
  color: string;
}

interface CategoryType extends AddCategoryType {
  id: number;
}

const createCategoriesTable = async (db: SQLiteDatabase): Promise<void> => {
  const sql = `
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      desc TEXT NOT NULL,
      icon TEXT NOT NULL,
      color TEXT NOT NULL
    );
  `;
  await db.execAsync(sql);
};

const getAllCategories = async (
  db: SQLiteDatabase,
): Promise<CategoryType[]> => {
  const result = await db.getAllAsync("SELECT * FROM categories;");
  return result as CategoryType[];
};

const insertCategory = async (
  newCategory: AddCategoryType,
  db: SQLiteDatabase,
): Promise<number> => {
  const { name, desc, icon = "", color = "" } = newCategory;
  const result = await db.runAsync(
    "INSERT INTO categories (name, desc, icon, color ) VALUES (?, ?, ?, ?);",
    [name, desc, icon, color],
  );
  return result.lastInsertRowId;
};

const getCategoryById = async (
  id: number,
  db: SQLiteDatabase,
): Promise<CategoryType | null> => {
  const result = await db.getFirstAsync(
    "SELECT * FROM categories WHERE id = ?;",
    [id],
  );
  return result ? (result as CategoryType) : null;
};

const updateCategory = async (
  category: CategoryType,
  db: SQLiteDatabase,
): Promise<boolean> => {
  const { name, desc, icon = "", color = "", id } = category;
  const result = await db.runAsync(
    "UPDATE categories SET title = ?, desc = ?, icon = ?, color = ? WHERE id = ?;",
    [name, desc, icon, color, id],
  );
  return result.changes > 0;
};

const deleteCategory = async (
  id: number,
  db: SQLiteDatabase,
): Promise<boolean> => {
  const result = await db.runAsync("DELETE FROM categories WHERE id = ?;", [
    id,
  ]);
  return result.changes > 0;
};

export {
  AddCategoryType,
  CategoryType,
  createCategoriesTable,
  getAllCategories,
  insertCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
