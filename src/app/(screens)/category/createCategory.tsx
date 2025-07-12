import { Icons } from "@/components/Atoms/Icons";
import { TouchableButton } from "@/components/Atoms/TouchableButtons";
import { CategoryForm } from "@/components/Organisms/Forms/CategoryForm";
import Container from "@/components/UI/Container";
import { useTheme } from "@/context/ThemeContext";
import { CreateCategoryType } from "@/database/categoriesSchema";
import useCategories from "@/queries/categories";
import { Stack, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { FlatList } from "react-native-gesture-handler";

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
