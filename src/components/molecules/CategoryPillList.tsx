import { ScrollView, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import { CategoryType } from "@/database/categoriesSchema";
import { useTheme } from "@/context/ThemeContext";
import { TouchableButton, Icons, Text } from "../atoms";

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
          marginBottom: 16,
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
              borderColor: theme.secondaryContainer,
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
    flexDirection: "row", // Arrange items in a row
    flexWrap: "wrap", // Allow items to wrap to the next line
    gap: 8, // Spacing between items
    // Add any necessary padding or margin for the overall container
  },
  pillButtonBase: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 32,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
  },
});
