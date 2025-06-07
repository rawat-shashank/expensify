import { materialTheme } from "@/constants"; // Assuming you have this
import { Stack } from "expo-router";
import { Platform, SafeAreaView, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AppLayout() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: materialTheme.background,
        paddingBottom: insets.bottom,
      }}
    >
      <Stack
        screenOptions={{
          headerShown: true,
        }}
      />
    </SafeAreaView>
  );
}
