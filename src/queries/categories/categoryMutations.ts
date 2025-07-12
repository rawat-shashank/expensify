import { SQLiteDatabase } from "expo-sqlite";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  CategoryType,
  CreateCategoryType,
  insertCategory as dbInsertCategory,
  updateCategory as dbUpdateCategory,
  deleteCategory as dbDeleteCategory,
} from "@/database/categoriesSchema";
import { categoryKeys } from "./categoryKeys";

export const useAddCategory = (db: SQLiteDatabase) => {
  const queryClient = useQueryClient();
  return useMutation<number | undefined, Error, CreateCategoryType>({
    mutationFn: async (params) => {
      const newCategoryId = await dbInsertCategory(params, db);
      return newCategoryId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.list() });
    },
  });
};

export const useUpdateCategory = (db: SQLiteDatabase) => {
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, CategoryType>({
    mutationFn: async (category) => {
      const success = await dbUpdateCategory(category, db);
      return success;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.list() });
      queryClient.invalidateQueries({
        queryKey: categoryKeys.details(variables.id!),
      });
    },
  });
};

export const useDeleteCategory = (db: SQLiteDatabase) => {
  const queryClient = useQueryClient();
  return useMutation<boolean | null, Error, number>({
    mutationFn: async (id) => {
      const success = await dbDeleteCategory(id, db);
      return success;
    },
    onSuccess: (_, deletedCategoryId) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.list() });
      queryClient.invalidateQueries({
        queryKey: categoryKeys.details(deletedCategoryId),
      });
    },
  });
};
