import { useTheme } from "@/context/ThemeContext";
import { StyleSheet, View } from "react-native";

export const ItemSeparator = () => {
  const { theme } = useTheme();
  return (
    <View style={[styles.separator, { borderColor: theme.surfaceDisabled }]} />
  );
};

const styles = StyleSheet.create({
  separator: {
    borderBottomWidth: 1,
    backgroundColor: "transparent",
    marginLeft: 48,
  },
});
