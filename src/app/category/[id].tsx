import { useRouter, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import alert from "@/components/Alert";
import useCategories from "@/queries/useCategories";
import { CategoryType } from "@/database/categoriesSchema";

const EditCategoryForm = () => {
  const db = useSQLiteContext();
  const { getCategoryById, updateCategory, deleteCategory } = useCategories(db);
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const categoryId = typeof id === "string" ? parseInt(id, 10) : undefined;
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentCategory, setCurrentCategory] = useState<
    CategoryType | undefined
  >(undefined);

  useEffect(() => {
    const loadCategory = async () => {
      if (categoryId) {
        setLoading(true);
        const category = await getCategoryById(categoryId);

        if (category) {
          setCurrentCategory(category);
          setTitle(category.title);
          setDesc(category.desc);
        } else {
          setError("Category not found.");
        }
        setLoading(false);
      } else {
        setError("Invalid category ID.");
        setLoading(false);
      }
    };

    loadCategory();
  }, [categoryId, getCategoryById]);

  const handleUpdateCategory = async () => {
    if (!title.trim() || !desc.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    if (currentCategory?.id) {
      const updatedCategory: CategoryType = {
        id: currentCategory.id,
        title,
        desc,
      };

      await updateCategory(updatedCategory);
      router.back();
    } else {
      setError("Could not update category: ID is missing.");
    }
  };

  const handleDeleteCategory = () => {
    if (currentCategory?.id) {
      alert(
        "Delete Category",
        `Are you sure you want to delete the account "${currentCategory.title}"?`,
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => {},
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              setLoading(true);
              const success = await deleteCategory(currentCategory.id);
              setLoading(false);
              if (success) {
                router.back();
              } else {
                setError("Failed to delete category.");
              }
            },
          },
        ],
      );
    }
  };

  if (loading) {
    return <Text>Loading account details...</Text>;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Edit Category</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Title:</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="e.g., Savings, Main Wallet"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Category Description:</Text>
        <TextInput
          style={styles.input}
          value={desc}
          onChangeText={setDesc}
          placeholder="e.g., My Bank Category, Personal Wallet"
        />
      </View>

      <TouchableOpacity
        style={styles.createButton}
        onPress={handleUpdateCategory}
      >
        <Text style={styles.createButtonText}>Update Category</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDeleteCategory}
      >
        <Text style={styles.deleteButtonText}>Delete Category</Text>
      </TouchableOpacity>
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
  deleteButton: {
    backgroundColor: "#dc3545",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default EditCategoryForm;
