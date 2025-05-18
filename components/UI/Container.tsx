import React from "react";
import { View, StyleSheet } from "react-native";

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
  },
});

export default Container;
