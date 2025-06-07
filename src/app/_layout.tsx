import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { initializeDatabase, resetDatabase } from "@/database";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { materialTheme } from "@/constants";
import { useColorScheme } from "react-native";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/queries/queryClient";
//import { useMaterial3Theme } from "@pchmn/expo-material3-theme";

export default function RootLayout() {
  //const colorScheme = useColorScheme();
  // This hook provides the Material You colors.
  // On Android 12+, it will use the dynamic system colors.
  // On other platforms/versions, it provides a fallback Material 3 palette.
  //const { theme } = useMaterial3Theme({ fallbackSourceColor: "#3E8260" });

  // Determine the active theme based on the system's color scheme
  //const activeColors = theme[colorScheme];

  // TODO: add custom theme
  return (
    <GestureHandlerRootView>
      <QueryClientProvider client={queryClient}>
        <SQLiteProvider
          databaseName="expensify.db"
          // @NOTE: this assetSource databse is read only
          //assetSource={{ assetId: require("../assets/expensify.db") }}
          onInit={initializeDatabase}
        >
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />;
            <Stack.Screen name="(screens)" options={{ headerShown: false }} />
          </Stack>
        </SQLiteProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
