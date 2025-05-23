import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { initializeDatabase } from "@/database";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import colors from "@/constants/colors";
import { SafeAreaView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RootLayout() {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.bg,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SQLiteProvider
          databaseName="expensify.db"
          // @NOTE: this assetSource databse is read only
          //assetSource={{ assetId: require("../assets/expensify.db") }}
          onInit={initializeDatabase}
        >
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />;
          </Stack>
        </SQLiteProvider>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
