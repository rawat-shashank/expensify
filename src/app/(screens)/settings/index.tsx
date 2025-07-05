import Container from "@/components/UI/Container";
import { Href, Stack, useRouter } from "expo-router";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";

// Define the structure for a settings item
interface SettingItem {
  id: string;
  title: string;
  description: string;
  href?: Href;
}

// Data for our settings list
const settingsData: SettingItem[] = [
  {
    id: "importExport",
    title: "Backup and restore",
    description: "Backup and restore your expenses, accounts & categories",
    href: "/settings/backupRestore",
  },
];

export default function SettingsMenuScreen() {
  const router = useRouter();
  const renderSettingItem = ({ item }: { item: SettingItem }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      activeOpacity={0.7}
      onPress={() => {
        if (item.href) {
          // if route exists push to router
          router.push(item.href);
        } else {
          // TODO: will handle it with modals/customSheet component
        }
      }}
    >
      <View style={styles.textContainer}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
      </View>
      <Text style={styles.arrowIcon}>›</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen options={{ title: "Settings" }} />
      <FlatList
        renderItem={null}
        data={null}
        ListHeaderComponent={
          <Container>
            <FlatList
              data={settingsData}
              renderItem={renderSettingItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </Container>
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5", // Light background color
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: "white", // Header background
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ccc",
  },
  listContent: {
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10, // Slightly rounded corners for list items
    marginBottom: 8, // Space between items
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  textContainer: {
    flex: 1, // Allow text to take up most space
    marginRight: 10,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 13,
    color: "#666",
  },
  separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 4, // More subtle separator due to item padding
    // Removed to allow itemContainer's marginBottom to work better
    // Removed if itemContainer has marginBottom
  },
  arrowIcon: {
    fontSize: 20,
    color: "#999",
    marginLeft: 10,
  },
});
