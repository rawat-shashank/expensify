import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { ActivityIndicator, FlatList } from "react-native";

import {
  Container,
  CategoryListItem,
  IconListItem,
  Text,
  ItemSeparator,
} from "@/components";
import { CategoryType } from "@/database/categoriesSchema";
import useCategories from "@/queries/categories";

const CategoryList = () => {
  const db = useSQLiteContext();
  if (!db) {
    return <Text>Database not ready.</Text>;
  }

  const router = useRouter();
  const { categories, isLoading } = useCategories(db);

  const handleCardPress = (categoryId: number) => {
    router.push(`/category/${categoryId}`);
  };

  const renderItem = ({ item }: { item: CategoryType }) => (
    <IconListItem
      icon={item.icon}
      color={item.color}
      onPress={() => handleCardPress(item.id)}
    >
      <CategoryListItem item={item} />
    </IconListItem>
  );

  if (isLoading) {
    return <ActivityIndicator size={"large"} />;
  }

  return (
    <FlatList
      renderItem={null}
      data={null}
      ListHeaderComponent={
        <Container>
          {categories && categories.length > 0 ? (
            <FlatList
              data={categories}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              ItemSeparatorComponent={ItemSeparator}
            />
          ) : (
            <Text>No categories created yet.</Text>
          )}
        </Container>
      }
    />
  );
};

export default CategoryList;
