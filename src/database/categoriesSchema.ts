import { IconsName } from "@/components/Atoms/Icons";
import { SQLiteDatabase } from "expo-sqlite";

// ---- Interface ----
interface CreateCategoryType {
  name: string;
  desc: string;
  icon: IconsName;
  color: string;
}

interface CategoryType extends CreateCategoryType {
  id: number;
}

// --- SQL Queries ---

const SQL_CREATE_CATEGORIES_TABLE = `
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    desc TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL
  );
`;

const SQL_GET_ALL_CATEGORIES = `
  SELECT * FROM categories;
`;

const SQL_INSERT_CATEGORY = `
  INSERT INTO categories (name, desc, icon, color )
  VALUES (?, ?, ?, ?);
`;

const SQL_GET_CATEGORY_BY_ID = `
  SELECT id, name, desc, icon, color FROM categories WHERE id = ?;
`;

const SQL_UPDATE_ACCOUNT = `
  UPDATE categories
  SET name = ?, desc = ?, icon = ?, color = ?
  WHERE id = ?;
`;

const SQL_DELETE_ACCOUNT = `
  DELETE FROM categories WHERE id = ?;
`;

// ---- Database Operations ----

const createCategoriesTable = async (db: SQLiteDatabase): Promise<void> => {
  await db.execAsync(SQL_CREATE_CATEGORIES_TABLE);
};

const getAllCategories = async (
  db: SQLiteDatabase,
): Promise<CategoryType[]> => {
  const result = await db.getAllAsync(SQL_GET_ALL_CATEGORIES);
  return result as CategoryType[];
};

const insertCategory = async (
  newCategory: CreateCategoryType,
  db: SQLiteDatabase,
): Promise<number> => {
  const { name, desc, icon = "", color = "" } = newCategory;
  const result = await db.runAsync(SQL_INSERT_CATEGORY, [
    name,
    desc,
    icon,
    color,
  ]);
  return result.lastInsertRowId;
};

const getCategoryById = async (
  id: number,
  db: SQLiteDatabase,
): Promise<CategoryType | null> => {
  const result = await db.getFirstAsync(SQL_GET_CATEGORY_BY_ID, [id]);
  return result ? (result as CategoryType) : null;
};

const updateCategory = async (
  category: CategoryType,
  db: SQLiteDatabase,
): Promise<boolean> => {
  const { name, desc, icon = "", color = "", id } = category;
  console.log({
    name,
    desc,
    icon,
    color,
    id,
  });
  const result = await db.runAsync(SQL_UPDATE_ACCOUNT, [
    name,
    desc,
    icon,
    color,
    id,
  ]);
  console.log("result", result);
  return result.changes > 0;
};

const deleteCategory = async (
  id: number,
  db: SQLiteDatabase,
): Promise<boolean> => {
  const result = await db.runAsync(SQL_DELETE_ACCOUNT, [id]);
  return result.changes > 0;
};

export {
  CreateCategoryType,
  CategoryType,
  createCategoriesTable,
  getAllCategories,
  insertCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
