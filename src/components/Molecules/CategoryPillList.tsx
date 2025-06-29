import { FlatList, Text, View } from "react-native";
import { TextLabel } from "../Atoms/TextLabel";
import { TouchableButton } from "../Atoms/TouchableButtons";
import { useRouter } from "expo-router";
import { Icons } from "../Atoms/Icons";
import { CategoryType } from "@/database/categoriesSchema";
import { useTheme } from "@/context/ThemeContext";

interface CateggoryPillListProps {
  categories: CategoryType[];
  activeCategoryId: number;
  onSelect: (id: number) => void;
  error?: string;
}
export const CategoryPillList = ({
  categories,
  activeCategoryId,
  onSelect,
  error,
}: CateggoryPillListProps) => {
  const { theme } = useTheme();
  const ItemSeparatorComponent = () => (
    <View style={{ width: 8, backgroundColor: "transparent" }} />
  );
  const router = useRouter();

  return (
    <View>
      <TextLabel label="Select category" />
      <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
        <TouchableButton
          onPress={() => {
            router.push("/(screens)/category/createCategory");
          }}
          style={{
            backgroundColor: theme.background,
            borderColor: theme.secondaryContainer,
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 32,
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
            borderWidth: 1,
          }}
        >
          <Icons name="plus" color={theme.tertiary} />
          <Text style={{ color: theme.onSurface }}>Add New</Text>
        </TouchableButton>
        <FlatList
          ItemSeparatorComponent={ItemSeparatorComponent}
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableButton
              onPress={() => onSelect(item.id)}
              style={{
                backgroundColor:
                  activeCategoryId === item.id
                    ? theme.secondaryContainer
                    : "transparent",

                borderColor:
                  activeCategoryId === item.id
                    ? theme.onSecondaryContainer
                    : theme.secondaryContainer,
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 32,
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 8,
                borderWidth: 1,
              }}
            >
              <Icons name={item.icon} color={theme.onSecondaryContainer} />
              <Text style={{ fontSize: 16, color: theme.onSurface }}>
                {item.name}
              </Text>
            </TouchableButton>
          )}
          extraData={activeCategoryId}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
        />
      </View>

      {error && (
        <Text
          style={{
            color: theme.error,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
};
