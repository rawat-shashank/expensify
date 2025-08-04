import { FlatList } from "react-native";
import { Stack, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";

import { useTheme } from "@/context/ThemeContext";
import { CreateCategoryType } from "@/database/categoriesSchema";
import useCategories from "@/queries/categories";
import { CategoryForm, Container, Icons, TouchableButton } from "@/components";
import { SPACINGS } from "@/constants/sizes";

const CreateCategory = ({}: {}) => {
  const { theme } = useTheme();
  const router = useRouter();
  const db = useSQLiteContext();
  const { addCategory } = useCategories(db);

  const onAddCategory = async (newCategory: CreateCategoryType) => {
    addCategory(newCategory);
    router.back();
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Add Category",
          headerLeft: () => (
            <TouchableButton
              onPress={() => router.back()}
              style={{
                paddingRight: SPACINGS.md,
              }}
            >
              <Icons name="arrow-back" color={theme.onSurface} />
            </TouchableButton>
          ),
          headerTitleStyle: {
            color: theme.onSurface,
          },
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
            <CategoryForm onAddCategory={onAddCategory} />
          </Container>
        }
      />
    </>
  );
};

export default CreateCategory;
