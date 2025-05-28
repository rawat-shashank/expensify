import { SQLiteDatabase } from "expo-sqlite";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  CategoryType,
  getAllCategories as dbGetAllCategories,
  insertCategory as dbInsertCategory,
  getCategoryById as dbGetCategoryById,
  updateCategory as dbUpdateCategory,
  deleteCategory as dbDeleteCategory,
  AddCategoryType,
} from "@/database/categoriesSchema";

export const categoryKeys = {
  all: ["category"] as const,
  list: () => [...categoryKeys.all, "list"] as const,
  details: (id: number) => [...categoryKeys.all, "details", id] as const,
};

const useCategories = (db: SQLiteDatabase) => {
  const queryClient = useQueryClient();

  // Query to fetch all categories
  const {
    data: categories,
    isLoading: isLoadingCategories,
    error: categoriesError,
    refetch: refetchCategories,
  } = useQuery<CategoryType[], Error>({
    queryKey: categoryKeys.list(),
    queryFn: () => dbGetAllCategories(db),
  });

  const {
    mutateAsync: getCategoryById,
    isPending: isGettingCategoryById,
    error: getCategoryByIdError,
  } = useMutation<CategoryType | null, Error, number>({
    mutationFn: (id) => dbGetCategoryById(id, db),
  });

  // Mutation to add a category
  const {
    mutateAsync: addCategory,
    isPending: isAddingCategory,
    error: addCategoryError,
  } = useMutation<number | undefined, Error, AddCategoryType>({
    mutationFn: async (params) => {
      const newCategoryId = await dbInsertCategory(params, db);
      return newCategoryId;
    },
    onSuccess: () => {
      // Invalidate the list of categories to trigger a refetch
      queryClient.invalidateQueries({ queryKey: categoryKeys.list() });
    },
  });

  // Mutation to update a category
  const {
    mutateAsync: updateCategory,
    isPending: isUpdatingCategory,
    error: updateCategoryError,
  } = useMutation<boolean, Error, CategoryType>({
    mutationFn: async (category) => {
      const success = await dbUpdateCategory(category, db);
      return success;
    },
    onSuccess: (_, variables) => {
      // Invalidate the list and the specific updated category
      queryClient.invalidateQueries({ queryKey: categoryKeys.list() });
      queryClient.invalidateQueries({
        queryKey: categoryKeys.details(variables.id!),
      });
    },
  });

  // Mutation to delete a category
  const {
    mutateAsync: deleteCategory,
    isPending: isDeletingCategory,
    error: deleteCategoryError,
  } = useMutation<boolean | null, Error, number>({
    mutationFn: async (id) => {
      const success = await dbDeleteCategory(id, db);
      return success;
    },
    onSuccess: (_, variables) => {
      // Invalidate the list and the specific deleted category
      queryClient.invalidateQueries({ queryKey: categoryKeys.list() });
      queryClient.invalidateQueries({
        queryKey: categoryKeys.details(variables),
      });
    },
  });

  return {
    categories: categories || [],
    isLoading:
      isLoadingCategories ||
      isGettingCategoryById ||
      isAddingCategory ||
      isUpdatingCategory ||
      isDeletingCategory,
    error:
      categoriesError ||
      getCategoryByIdError ||
      addCategoryError ||
      updateCategoryError ||
      deleteCategoryError,
    addCategory,
    updateCategory,
    deleteCategory,
    refetchCategories,
    getCategoryById,
  };
};

export default useCategories;
