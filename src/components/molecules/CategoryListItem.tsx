import { StyleSheet, View } from "react-native";
import { Text } from "../atoms";
import { CategoryType } from "@/database/categoriesSchema";
import { FONT_SIZES } from "@/constants";
import { SPACINGS } from "@/constants/sizes";

interface CategoryListItemProps {
  item: CategoryType;
}

export const CategoryListItem = ({ item }: CategoryListItemProps) => {
  return (
    <View style={styles.card}>
      <Text size={FONT_SIZES.body}>{item.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingVertical: SPACINGS.md,
    flex: 1,
  },
});
