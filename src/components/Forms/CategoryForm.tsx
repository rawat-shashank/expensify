import { AddCategoryType, CategoryType } from "@/database/categoriesSchema";
import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { InputField } from "./InputField";
import { Picker } from "../Molecules/Picker";

interface CategoryFormProps {
  category?: CategoryType;
  onAddCategory?: (newCategory: AddCategoryType) => Promise<void>;
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
  const [name, setName] = useState(category?.name || "");
  const [desc, setDesc] = useState(category?.desc || "");
  const [icon, setIcon] = useState(category?.icon || "home");
  const [color, setColor] = useState(category?.color || "");
  const [errors, setErrors] = useState<CategoryFormErrors>({});

  const handleCreateCategory = async () => {
    const newErrors: CategoryFormErrors = {};
    if (!name.trim()) {
      newErrors.name = "Category required.";
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const newCategory: AddCategoryType = {
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
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, gap: 16 }}>
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
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateCategory}
        >
          <Text style={styles.createButtonText}>
            {onUpdateCategory ? "Update" : "Create"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  pickerContainer: {
    marginBottom: 15,
  },
  typeButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 5,
  },
  typeButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  activeTypeButton: {
    backgroundColor: "#007bff",
  },
  typeButtonText: {
    fontSize: 16,
    color: "#333",
  },
  activeTypeButtonText: {
    color: "#fff",
  },
  createButton: {
    backgroundColor: "#28a745",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  createButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
