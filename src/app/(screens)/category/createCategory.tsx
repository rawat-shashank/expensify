import { Icons } from "@/components/Atoms/Icons";
import { TouchableButton } from "@/components/Atoms/TouchableButtons";
import { CategoryForm } from "@/components/Organisms/Forms/CategoryForm";
import Container from "@/components/UI/Container";
import { useTheme } from "@/context/ThemeContext";
import { AddCategoryType } from "@/database/categoriesSchema";
import useCategories from "@/queries/useCategories";
import { Stack, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";

const CreateCategory = ({}: {}) => {
  const { theme } = useTheme();
  const router = useRouter();
  const db = useSQLiteContext();
  const { addCategory } = useCategories(db);

  const onAddCategory = async (newCategory: AddCategoryType) => {
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
                paddingRight: 16,
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
      <Container>
        <CategoryForm onAddCategory={onAddCategory} />
      </Container>
    </>
  );
};

export default CreateCategory;
