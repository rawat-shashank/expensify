import { SQLiteDatabase } from "expo-sqlite";
import { useQuery } from "@tanstack/react-query";

import {
  CategoryType,
  getAllCategories as dbGetAllCategories,
  getCategoryById as dbGetCategoryById,
} from "@/database/categoriesSchema";
import { categoryKeys } from "./categoryKeys";

export const useGetAllCategories = (db: SQLiteDatabase) => {
  return useQuery<CategoryType[], Error>({
    queryKey: categoryKeys.list(),
    queryFn: () => dbGetAllCategories(db),
  });
};

export const useGetCategoryById = (db: SQLiteDatabase, categoryId: number) => {
  return useQuery<CategoryType | null, Error>({
    queryKey: categoryKeys.details(categoryId),
    queryFn: () => dbGetCategoryById(categoryId, db),
    enabled: !!categoryId, // Only run the query if categoryId is provided
  });
};
