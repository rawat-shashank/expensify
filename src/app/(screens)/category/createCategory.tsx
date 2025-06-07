import { CategoryForm } from "@/components/Forms/CategoryForm";
import Container from "@/components/UI/Container";
import { AddCategoryType } from "@/database/categoriesSchema";
import useCategories from "@/queries/useCategories";
import { Stack, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";

const CreateCategory = ({}: {}) => {
  const router = useRouter();
  const db = useSQLiteContext();
  const { addCategory } = useCategories(db);

  const onAddCategory = async (newCategory: AddCategoryType) => {
    console.log(newCategory);
    const id = await addCategory(newCategory);
    console.log(id);
    router.back();
  };

  return (
    <>
      <Stack.Screen options={{ title: "Add Category" }} />
      <Container>
        <CategoryForm onAddCategory={onAddCategory} />
      </Container>
    </>
  );
};

export default CreateCategory;
