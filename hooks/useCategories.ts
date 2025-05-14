import { SQLiteDatabase } from "expo-sqlite";
import { useCallback, useEffect, useState } from "react";

import {
  CategoryType,
  getAllCategories as dbGetAllCategories,
  insertCategory as dbInsertCategory,
  getCategoryById as dbGetCategoryById,
  updateCategory as dbUpdateCategory,
  deleteCategory as dbDeleteCategory,
} from "@/database/categoriesSchema";

interface UseCategoriesResult {
  categories: CategoryType[];
  loading: boolean;
  error: Error | null;
  fetchCategories: () => Promise<void>;
  addCategory: (title: string, desc: string) => Promise<number | undefined>;
  getCategoryById: (id: number) => Promise<CategoryType | null>;
  updateCategory: (category: CategoryType) => Promise<boolean | null>;
  deleteCategory: (id: number) => Promise<boolean | null>;
}

const useCategories = (db: SQLiteDatabase): UseCategoriesResult => {
  // TODO:check it once more to refactor this
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedCategories = await dbGetAllCategories(db);
      setCategories(fetchedCategories);
      setError(null);
    } catch (err: any) {
      setError(err);
      setCategories([]);
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addCategory = useCallback(
    async (title: string, desc: string): Promise<number | undefined> => {
      try {
        setLoading(true);
        const newCategoryId = await dbInsertCategory(title, desc, db);
        await fetchCategories();
        return newCategoryId;
      } catch (err: any) {
        setError(err);
        console.error("Error inserting category:", err);
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    [fetchCategories],
  );

  const getCategoryById = useCallback(
    async (id: number): Promise<CategoryType | null> => {
      try {
        setLoading(true);
        const category = await dbGetCategoryById(id, db);
        return category;
      } catch (err: any) {
        setError(err);
        console.error(`Error fetching category with ID ${id}:`, err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchCategories],
  );

  const updateCategory = useCallback(
    async (category: CategoryType): Promise<boolean> => {
      try {
        setLoading(true);
        const success = await dbUpdateCategory(category, db);
        if (success) {
          await fetchCategories();
          return true;
        }
        return false;
      } catch (err: any) {
        setError(err);
        console.error(`Error updating category with ID ${category.id}:`, err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchCategories],
  );

  const deleteCategory = useCallback(
    async (id: number): Promise<boolean | null> => {
      try {
        setLoading(true);
        const res = await dbDeleteCategory(id, db);
        if (res) {
          await fetchCategories();
        }
        return res;
      } catch (err: any) {
        setError(err);
        console.error(`Error deleting category with ID ${id}:`, err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchCategories],
  );

  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
        await fetchCategories();
      } catch (err: any) {
        setError(err);
        console.error("Error fetching categories data:", err);
      } finally {
        setLoading(false);
      }
    };
    initialize();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    addCategory,
    getCategoryById,
    updateCategory,
    deleteCategory,
  };
};

export default useCategories;
