import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { setupDatabase } from "@/database";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/queries/queryClient";
import {
  UserAccountProvider,
  useUserAccount,
} from "@/context/UserAccountContext";

const App = () => {
  const { theme } = useUserAccount();

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
          <UserAccountProvider>
            <App />
          </UserAccountProvider>
        </SQLiteProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
