import { StyleSheet, View } from "react-native";

import { CategoryType } from "@/database/categoriesSchema";
import { FONT_SIZES } from "@/constants";
import { SPACINGS } from "@/constants/sizes";
import { useUserAccount } from "@/context/UserAccountContext";

import { Text } from "@/components/atoms";

interface CategoryListItemProps {
  item: CategoryType;
}

export const CategoryListItem = ({ item }: CategoryListItemProps) => {
  const { theme } = useUserAccount();
  return (
    <View style={styles.card}>
      <Text color={theme.onSurface}>{item.name}</Text>
      {item?.desc && (
        <Text size={FONT_SIZES.caption} color={theme.onSurface}>
          {item.desc}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingVertical: SPACINGS.sm,
    flex: 1,
  },
});
