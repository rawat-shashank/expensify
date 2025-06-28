import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { initializeDatabase, resetDatabase } from "@/database";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/queries/queryClient";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";

const App = () => {
  const { theme } = useTheme();
  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: theme.background,
        },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />;
      <Stack.Screen name="(screens)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <SQLiteProvider
            databaseName="expensify.db"
            // @NOTE: this assetSource databse is read only
            //assetSource={{ assetId: require("../assets/expensify.db") }}
            onInit={initializeDatabase}
          >
            <App />
          </SQLiteProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
