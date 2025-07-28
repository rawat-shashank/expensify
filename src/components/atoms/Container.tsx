import { useTheme } from "@/context/ThemeContext";
import React from "react";
import { StyleSheet, View } from "react-native";

interface Props {
  children: React.ReactNode;
  style?: any;
  paddingVertical?: number;
}

export const Container: React.FC<Props> = ({
  children,
  style,
  paddingVertical = 0,
}) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        style,
        {
          backgroundColor: theme.background,
          paddingVertical,
        },
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
