import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import { useColorScheme } from "react-native";

export function useAppTheme(fallbackColor: string = "#3E8260") {
  const colorScheme = useColorScheme() || "light";

  const { theme } = useMaterial3Theme({
    fallbackSourceColor: fallbackColor,
  });

  return {
    currentTheme: theme,
    colorScheme: colorScheme,
  };
}
