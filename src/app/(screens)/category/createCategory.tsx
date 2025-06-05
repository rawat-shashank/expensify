import Container from "@/components/UI/Container";
import { AddCategoryType, CategoryType } from "@/database/categoriesSchema";
import useCategories from "@/queries/useCategories";
import { Stack, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";

const CreateCategory = ({}: {}) => {
  const db = useSQLiteContext();
  const { addCategory } = useCategories(db);

  return <CreateCategoryForm addCategory={addCategory} />;
};

const CreateCategoryForm = ({
  addCategory,
}: {
  addCategory: (newCategory: AddCategoryType) => Promise<number | undefined>;
}) => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [error, setError] = useState("");

  const handleCreateCategory = async () => {
    if (!title.trim() || !desc.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    const newCategory: Omit<CategoryType, "id"> = {
      title,
      desc,
    };

    await addCategory(newCategory);
    router.back();
  };

  return (
    <>
      <Stack.Screen options={{ title: "Add Category" }} />
      <Container>
        <Text style={styles.heading}>Create New Category</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Title:</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g., Housing, Grocries"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Category Description:</Text>
          <TextInput
            style={styles.input}
            value={desc}
            onChangeText={setDesc}
            placeholder="e.g., Category description"
          />
        </View>

        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateCategory}
        >
          <Text style={styles.createButtonText}>Create Category</Text>
        </TouchableOpacity>
      </Container>
    </>
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

export default CreateCategory;
