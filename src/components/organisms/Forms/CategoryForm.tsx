import { CreateCategoryType, CategoryType } from "@/database/categoriesSchema";
import { useState } from "react";
import { View, StyleSheet } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { Text, InputField, IconsNameType, TouchableButton } from "../../atoms";
import { Picker } from "@/components/molecules";
import { FONT_SIZES, SPACINGS } from "@/constants/sizes";

interface CategoryFormProps {
  category?: CategoryType;
  onAddCategory?: (newCategory: CreateCategoryType) => Promise<void>;
  onUpdateCategory?: (category: CategoryType) => Promise<void>;
}

interface CategoryFormErrors {
  name?: string;
}

export const CategoryForm = ({
  category,
  onAddCategory,
  onUpdateCategory,
}: CategoryFormProps) => {
  const { theme } = useTheme();

  const [name, setName] = useState(category?.name || "");
  const [desc, setDesc] = useState(category?.desc || "");
  const [icon, setIcon] = useState<IconsNameType>(category?.icon || "home");
  const [color, setColor] = useState(category?.color || "");
  const [errors, setErrors] = useState<CategoryFormErrors>({});

  const handleCreateCategory = async () => {
    const newErrors: CategoryFormErrors = {};
    if (!name.trim()) {
      newErrors.name = "Category required.";
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const newCategory: CreateCategoryType = {
        name,
        desc,
        color,
        icon,
      };
      if (category?.id && onUpdateCategory) {
        onUpdateCategory({ ...newCategory, id: category.id });
      } else if (onAddCategory) {
        onAddCategory(newCategory);
      }
    }
  };

  return (
    <View style={{ flex: 1, paddingVertical: SPACINGS.md }}>
      <View style={{ flex: 1, gap: SPACINGS.md }}>
        <InputField
          value={name}
          onUpdate={setName}
          placeholder="Enter category"
          error={errors.name}
        />

        <InputField
          value={desc}
          onUpdate={setDesc}
          placeholder="Enter description"
        />

        <Picker variant="icon" value={icon} onSelect={setIcon} />
        <Picker variant="color" value={color} onSelect={setColor} />
      </View>
      {(onAddCategory || onUpdateCategory) && (
        <TouchableButton variant="submit" onPress={handleCreateCategory}>
          <Text
            size={FONT_SIZES.subheading}
            color={theme.onPrimary}
            style={styles.createButtonText}
          >
            {onUpdateCategory ? "Update" : "Create"}
          </Text>
        </TouchableButton>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  createButtonText: {
    fontWeight: "bold",
  },
});
