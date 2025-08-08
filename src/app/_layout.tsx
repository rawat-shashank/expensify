import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { setupDatabase, resetDatabase } from "@/database";
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
      <QueryClientProvider client={queryClient}>
        <SQLiteProvider
          databaseName="expensify.db"
          // @NOTE: this assetSource databse is read only
          //assetSource={{ assetId: require("../assets/expensify.db") }}
          onInit={setupDatabase}
        >
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </SQLiteProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
