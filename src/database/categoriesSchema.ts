import { SQLiteDatabase } from "expo-sqlite";

interface AddCategoryType {
  title: string; // category
  desc: string; // description of the category
}

interface CategoryType extends AddCategoryType {
  id: number;
}

const createCategoriesTable = async (db: SQLiteDatabase): Promise<void> => {
  const sql = `
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      desc TEXT NOT NULL
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
  const { title, desc } = newCategory;
  const result = await db.runAsync(
    "INSERT INTO categories (title, desc ) VALUES (?, ?);",
    [title, desc],
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
  const { title, desc, id } = category;
  const result = await db.runAsync(
    "UPDATE categories SET title = ?, desc = ? WHERE id = ?;",
    [title, desc, id],
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
