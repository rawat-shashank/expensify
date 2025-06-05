import Header from "@/components/Header";
import { materialTheme } from "@/constants"; // Assuming you have this
import { Stack, useRouter } from "expo-router";
import { Platform, SafeAreaView, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AppLayout() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: materialTheme.background, // Your desired background color
        // Add padding only if you need space *below* the status bar
        // If your design allows content to go behind the status bar, you might not need this.
        paddingTop:
          Platform.OS === "android" ? StatusBar.currentHeight : insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <Stack
        screenOptions={{
          headerShown: true, // Ensure no header is shown for any screen in this group
          header: ({ options, route }) => {
            const router = useRouter();
            const canGoBack = router.canGoBack();
            return (
              <Header
                title={options.title}
                leftIcon={canGoBack ? "arrow-back" : undefined}
                onLeftIconPress={() => router.back()}
                routeName={route.name}
              />
            );
          },
        }}
      />
    </SafeAreaView>
  );
}
