import { useTheme } from "@/context/ThemeContext";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AppLayout() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingBottom: insets.bottom,
      }}
    >
      <Stack
        screenOptions={{
          headerShown: true,
          headerTitleStyle: {
            color: theme.onSurface,
          },
        }}
      />
    </SafeAreaView>
  );
}
