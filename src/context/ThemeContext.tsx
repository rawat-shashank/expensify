// context/ThemeContext.tsx
import React, { createContext, useContext, ReactNode } from "react";
import { Material3Scheme, Material3Theme } from "@pchmn/expo-material3-theme";
import { useAppTheme } from "@/hooks/useMaterial3Theme";

interface ThemeContextType {
  theme: Material3Scheme;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { currentTheme, colorScheme } = useAppTheme();

  return (
    <ThemeContext.Provider value={{ theme: currentTheme[colorScheme] }}>
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
