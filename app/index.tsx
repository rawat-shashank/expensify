import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { initializeDatabase } from "@/database";
import { useSQLiteContext } from "expo-sqlite";

export default function App() {
  const [isDbInitialized, setIsDbInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const db = useSQLiteContext();

  useEffect(() => {
    const initialize = async () => {
      try {
        if (db) {
          await initializeDatabase(db);
          setIsDbInitialized(true);
        }
      } catch (err: any) {
        setError(err);
        console.error("Error initializing database in layout:", err.message);
        setIsDbInitialized(true);
      }
    };

    initialize();
  }, []);

  if (!isDbInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Error initializing database: {error.message}</Text>
      </View>
    );
  }
  return;
}
