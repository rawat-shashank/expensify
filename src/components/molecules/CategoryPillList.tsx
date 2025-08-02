import { ScrollView, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import { CategoryType } from "@/database/categoriesSchema";
import { useTheme } from "@/context/ThemeContext";
import { TouchableButton, Icons, Text } from "../atoms";
import { SPACINGS } from "@/constants/sizes";

interface CategoryPillListProps {
  categories: CategoryType[];
  activeCategoryId: number;
  onSelect: (id: number) => void;
}

export const CategoryPillList = ({
  categories,
  activeCategoryId,
  onSelect,
}: CategoryPillListProps) => {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <View>
      <Text
        color={theme.tertiary}
        style={{
          marginBottom: SPACINGS.md,
          fontWeight: "bold",
        }}
      >
        Select category
      </Text>

      <ScrollView
        horizontal={false}
        contentContainerStyle={styles.pillListContentContainer}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <TouchableButton
          onPress={() => {
            router.push("/(screens)/category/createCategory");
          }}
          style={[
            styles.pillButtonBase,
            {
              backgroundColor: theme.background,
              borderColor: theme.onSurfaceDisabled,
            },
          ]}
        >
          <Icons name="plus" color={theme.tertiary} />
          <Text color={theme.onSurface}>Add New</Text>
        </TouchableButton>

        {categories.map((item) => (
          <TouchableButton
            key={item.id.toString()}
            onPress={() => onSelect(item.id)}
            style={[
              styles.pillButtonBase,
              {
                backgroundColor:
                  activeCategoryId === item.id
                    ? theme.secondaryContainer
                    : "transparent",
                borderColor:
                  activeCategoryId === item.id
                    ? theme.onSecondaryContainer
                    : theme.onSurfaceDisabled,
              },
            ]}
          >
            <Icons
              name={item.icon as any}
              color={
                activeCategoryId === item.id
                  ? theme.onSurface
                  : theme.onSurfaceVariant
              }
            />
            <Text
              color={
                activeCategoryId === item.id
                  ? theme.onSurface
                  : theme.onSurfaceVariant
              }
            >
              {item.name}
            </Text>
          </TouchableButton>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  pillListContentContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACINGS.xs,
  },
  pillButtonBase: {
    paddingVertical: SPACINGS.xs,
    paddingHorizontal: SPACINGS.md,
    borderRadius: SPACINGS.xl,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: SPACINGS.xs,
    borderWidth: 1,
  },
});
