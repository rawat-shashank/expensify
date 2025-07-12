import { SQLiteDatabase } from "expo-sqlite";
import {
  useAddCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "./categoryMutations";
import { useGetAllCategories, useGetCategoryById } from "./categoryQueries";

/**
 * A comprehensive hook for managing categories, combining various query and mutation hooks.
 * @param db The SQLiteDatabase instance.
 * @param options Optional configuration, e.g., for fetching a specific category by ID.
 */
export const useCategories = (
  db: SQLiteDatabase,
  options?: {
    categoryId?: number;
  },
) => {
  // Queries
  const {
    data: categories,
    isLoading: isLoadingCategories,
    error: categoriesError,
    refetch: refetchCategories,
  } = useGetAllCategories(db);

  const {
    data: categoryDetails,
    isLoading: isLoadingCategoryDetails,
    error: categoryDetailsError,
    refetch: refetchCategoryDetails,
  } = useGetCategoryById(db, options?.categoryId as number);

  // Mutations
  const {
    mutateAsync: addCategory,
    isPending: isAddingCategory,
    error: addCategoryError,
  } = useAddCategory(db);

  const {
    mutateAsync: updateCategory,
    isPending: isUpdatingCategory,
    error: updateCategoryError,
  } = useUpdateCategory(db);

  const {
    mutateAsync: deleteCategory,
    isPending: isDeletingCategory,
    error: deleteCategoryError,
  } = useDeleteCategory(db);

  // Combine loading states for convenience
  const isLoading =
    isLoadingCategories ||
    isAddingCategory ||
    isUpdatingCategory ||
    isDeletingCategory ||
    isLoadingCategoryDetails;

  // Combine errors for convenience
  const error =
    categoriesError ||
    addCategoryError ||
    updateCategoryError ||
    deleteCategoryError ||
    categoryDetailsError;

  return {
    // Data
    categories: categories || [],
    categoryDetails: categoryDetails || null,

    // Loading States
    isLoading,

    // Errors
    error,

    // Mutations
    addCategory,
    updateCategory,
    deleteCategory,

    // Refetch Functions
    refetchCategories,
    refetchCategoryDetails,
  };
};

export default useCategories;
