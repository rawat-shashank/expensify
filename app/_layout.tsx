import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { initializeDatabase } from "@/database";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SQLiteProvider
        databaseName="expensify.db"
        // @NOTE: this assetSource databse is read only
        //assetSource={{ assetId: require("../assets/expensify.db") }}
        onInit={initializeDatabase}
      >
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: "#000",
            },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />;
        </Stack>
      </SQLiteProvider>
    </GestureHandlerRootView>
  );
}
