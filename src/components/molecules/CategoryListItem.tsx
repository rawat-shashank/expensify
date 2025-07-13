import { StyleSheet, View } from "react-native";
import { Text } from "../atoms";
import { CategoryType } from "@/database/categoriesSchema";

interface CategoryListItemProps {
  item: CategoryType;
}

export const CategoryListItem = ({ item }: CategoryListItemProps) => {
  return (
    <View style={styles.card}>
      <Text>{item.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingVertical: 16,
    flex: 1,
  },
});
