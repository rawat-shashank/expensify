import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { Material3Scheme } from "@pchmn/expo-material3-theme";

import { useAppTheme } from "@/hooks/useMaterial3Theme";
import { ASYNC_STORAGE_KEYS } from "@/constants/async-storage-keys";
import { getAsyncStorageData } from "@/utilities/async-storage";
import { defaultTheme } from "@/constants/colors";
import { ActivityIndicator } from "react-native";

interface ThemeContextType {
  theme: Material3Scheme;
  colorScheme: "dark" | "light";
  isMaterialYou: boolean;
  setIsMaterialYou: (value: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { currentTheme, colorScheme } = useAppTheme();

  const [userTheme, setUserTheme] = useState<boolean>(null);
  const [isLoading, setIsLoading] = useState(true);

  const toggleMaterialYou = async (value: boolean) => {
    setUserTheme(value);
    await setAsyncStorageData(
      ASYNC_STORAGE_KEYS.MATERIAL_YOU,
      value.toString(),
    );
  };

  useEffect(() => {
    const getStoredTheme = async () => {
      try {
        const userStoredTheme = await getAsyncStorageData(
          ASYNC_STORAGE_KEYS.MATERIAL_YOU,
        );
        if (userStoredTheme) {
          setUserTheme(true);
        } else {
          setUserColorScheme(false);
        }
      } catch (e) {
        setUserColorScheme(false);
      } finally {
        setIsLoading(false);
      }
    };

    getStoredTheme();
  }, []);

  if (isLoading || !userTheme) {
    <ActivityIndicator size="large" />;
  }

  return (
    <ThemeContext.Provider
      value={{
        theme: userTheme
          ? currentTheme[colorScheme]
          : defaultTheme[colorScheme],
        colorScheme,
        isMaterialYou: userTheme,
        setIsMaterialYou: toggleMaterialYou,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
