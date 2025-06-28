// hooks/useAppTheme.ts
import { useMaterial3Theme, Material3Theme } from "@pchmn/expo-material3-theme";
import { useColorScheme } from "react-native";

export function useAppTheme(fallbackColor: string = "#3E8260") {
  const colorScheme = useColorScheme();

  const { theme } = useMaterial3Theme({
    fallbackSourceColor: fallbackColor,
  });

  const currentTheme: Material3Theme = theme;

  return {
    currentTheme,
    colorScheme: colorScheme || "light",
  };
}
