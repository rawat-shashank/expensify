import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useState, useEffect } from "react";
import { Text, TouchableOpacity } from "react-native";
import alert from "@/components/Alert";
import useCategories from "@/queries/useCategories";
import { CategoryType } from "@/database/categoriesSchema";
import Container from "@/components/UI/Container";
import { Icons } from "@/components/Atoms/Icons";
import { CategoryForm } from "@/components/Organisms/Forms/CategoryForm";
import { useTheme } from "@/context/ThemeContext";
import { TouchableButton } from "@/components/Atoms/TouchableButtons";
import { FlatList } from "react-native-gesture-handler";

const EditCategoryForm = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const db = useSQLiteContext();
  const { getCategoryById, updateCategory, deleteCategory } = useCategories(db);

  const { id } = useLocalSearchParams();
  const categoryId = typeof id === "string" ? parseInt(id, 10) : undefined;

  const [loadingCategory, setLoadingCategory] = useState(true);
  const [currentCategory, setCurrentCategory] = useState<
    CategoryType | undefined
  >(undefined);

  useEffect(() => {
    const loadCategory = async () => {
      if (categoryId) {
        setLoadingCategory(true);
        const category = await getCategoryById(categoryId);

        if (category) {
          setCurrentCategory(category);
        }
        setLoadingCategory(false);
      } else {
        setLoadingCategory(false);
      }
    };

    loadCategory();
  }, [categoryId, getCategoryById]);

  const handleUpdateCategory = async (category: CategoryType) => {
    await updateCategory(category);
    router.back();
  };

  const handleDeleteCategory = () => {
    if (currentCategory?.id) {
      alert(
        "Delete Category",
        `Are you sure you want to delete the category "${currentCategory.name}"?`,
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => {},
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              setLoadingCategory(true);
              const success = await deleteCategory(currentCategory.id);
              setLoadingCategory(false);
              if (success) {
                router.back();
              }
            },
          },
        ],
      );
    }
  };

  if (loadingCategory) {
    return <Text>Loading account details...</Text>;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Update Category",
          headerTitleStyle: {
            color: theme.onSurface,
          },
          headerLeft: () => (
            <TouchableButton
              onPress={() => router.back()}
              style={{
                paddingRight: 16,
              }}
            >
              <Icons name="arrow-back" color={theme.onSurface} />
            </TouchableButton>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handleDeleteCategory}>
              <Icons name="delete" color={theme.onSurface} />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: theme.background,
          },
        }}
      />

      <FlatList
        renderItem={null}
        data={null}
        ListHeaderComponent={
          <Container>
            <CategoryForm
              category={currentCategory}
              onUpdateCategory={handleUpdateCategory}
            />
          </Container>
        }
      />
    </>
  );
};

export default EditCategoryForm;
