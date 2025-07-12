import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import alert from "@/components/Alert";
import useCategories from "@/queries/categories";
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

  const { id } = useLocalSearchParams();
  const categoryId = typeof id === "string" ? parseInt(id, 10) : 0;
  const { categoryDetails, isLoading, updateCategory, deleteCategory } =
    useCategories(db, { categoryId });

  const handleUpdateCategory = async (category: CategoryType) => {
    await updateCategory(category);
    router.back();
  };

  const handleDeleteCategory = () => {
    if (categoryDetails?.id) {
      alert(
        "Delete Category",
        `Are you sure you want to delete the category "${categoryDetails.name}"?`,
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
              const success = await deleteCategory(categoryDetails.id);
              if (success) {
                router.back();
              }
            },
          },
        ],
      );
    }
  };

  if (isLoading) {
    return <Text>Loading account details...</Text>;
  }

  if (!categoryDetails) {
    return (
      <View>
        <Text>No Category for this ID </Text>
      </View>
    );
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
              category={categoryDetails}
              onUpdateCategory={handleUpdateCategory}
            />
          </Container>
        }
      />
    </>
  );
};

export default EditCategoryForm;
