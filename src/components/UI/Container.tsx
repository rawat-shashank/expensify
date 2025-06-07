import { materialTheme } from "@/constants";
import React from "react";
import { StyleSheet, View } from "react-native";

interface Props {
  children: React.ReactNode;
  style?: any;
}

const Container: React.FC<Props> = ({ children, style }) => {
  return <View style={[styles.container, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: materialTheme.background,
  },
});

export default Container;
