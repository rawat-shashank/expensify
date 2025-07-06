// hooks/useAppTheme.ts
//import { useMaterial3Theme, Material3Theme } from "@pchmn/expo-material3-theme";
import { materialTheme } from "@/constants/colors";
import { useColorScheme } from "react-native";

declare enum ElevationLevels {
  "level0" = 0,
  "level1" = 1,
  "level2" = 2,
  "level3" = 3,
  "level4" = 4,
  "level5" = 5,
}

interface SystemScheme {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;
  background: string;
  onBackground: string;
  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  outline: string;
  outlineVariant: string;
  inverseSurface: string;
  inverseOnSurface: string;
  inversePrimary: string;
}

export type Material3Scheme = SystemScheme & {
  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;
  shadow: string;
  scrim: string;
  surfaceDisabled: string;
  onSurfaceDisabled: string;
  backdrop: string;
  surfaceContainer: string;
  surfaceContainerLow: string;
  surfaceContainerLowest: string;
  surfaceContainerHigh: string;
  surfaceContainerHighest: string;
  surfaceBright: string;
  surfaceDim: string;
  surfaceTint: string;
  elevation: {
    [key in keyof typeof ElevationLevels]: string;
  };
};

export type Material3Theme = {
  light: Material3Scheme;
  dark: Material3Scheme;
};

//export function useAppTheme(fallbackColor: string = "#3E8260") {
export function useAppTheme() {
  const colorScheme = useColorScheme();

  //const { theme } = useMaterial3Theme({
  //  fallbackSourceColor: fallbackColor,
  //});

  const currentTheme: Material3Theme = {
    light: materialTheme,
    dark: materialTheme,
  };

  return {
    currentTheme,
    colorScheme: colorScheme || "light",
  };
}
