import { useTheme } from "@/context/ThemeContext";
import React from "react";
import { StyleSheet, View } from "react-native";

interface Props {
  children: React.ReactNode;
  style?: any;
}

const Container: React.FC<Props> = ({ children, style }) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        style,
        {
          backgroundColor: theme.background,
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
    padding: 16,
  },
});

export default Container;
