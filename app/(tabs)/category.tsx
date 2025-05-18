import { CategoryType } from "@/database/categoriesSchema";
import useCategories from "@/hooks/useCategories";
import { useFocusEffect, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useCallback } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";

const CategoryList = () => {
  const db = useSQLiteContext();
  if (!db) {
    return <Text>Database not ready.</Text>;
  }
  const { categories, loading, fetchCategories } = useCategories(db);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      fetchCategories();
      return () => {};
    }, [fetchCategories]),
  );

  const handleCardPress = (categoryId: number) => {
    router.push(`/category/${categoryId}`);
  };

  const renderItem = ({ item }: { item: CategoryType }) => (
    <TouchableOpacity onPress={() => handleCardPress(item.id)}>
      <View style={styles.card}>
        <Text style={styles.accountName}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size={"large"} />;
  }

  return (
    <View style={styles.container}>
      {categories && categories.length > 0 ? (
        <FlatList
          data={categories}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.flatListContent}
        />
      ) : (
        <Text>No categories created yet.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  flatListContent: {
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    padding: 16,
    marginBottom: 8,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  accountName: {
    fontSize: 16,
    color: "#555",
  },
  amount: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  dateCreated: {
    fontSize: 12,
    color: "#777",
  },
  bankIcon: {
    width: 20,
    height: 20,
    borderRadius: 5,
    backgroundColor: "#4CAF50",
  },
  walletIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#2196F3",
  },
  cashIcon: {
    width: 20,
    height: 20,
    borderRadius: 2,
    backgroundColor: "#FF9800",
  },
});

export default CategoryList;
