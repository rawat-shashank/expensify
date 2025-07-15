import { TouchableOpacity, View, FlatList, Alert } from "react-native";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";

import useCategories from "@/queries/categories";
import { CategoryType } from "@/database/categoriesSchema";
import {
  Text,
  CategoryForm,
  Container,
  Icons,
  TouchableButton,
} from "@/components";
import { useTheme } from "@/context/ThemeContext";

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
      Alert.alert(
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
        contentContainerStyle={{
          paddingVertical: 16,
        }}
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
