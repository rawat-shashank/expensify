import { StyleSheet, View } from "react-native";
import { Text } from "../atoms";
import { CategoryType } from "@/database/categoriesSchema";
import { FONT_SIZES } from "@/constants";
import { SPACINGS } from "@/constants/sizes";
import { useUserAccount } from "@/context/UserAccountContext";

interface CategoryListItemProps {
  item: CategoryType;
}

export const CategoryListItem = ({ item }: CategoryListItemProps) => {
  const { theme } = useUserAccount();
  return (
    <View style={styles.card}>
      <Text size={FONT_SIZES.body} color={theme.onSurface}>
        {item.name}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingVertical: SPACINGS.md,
    flex: 1,
  },
});
