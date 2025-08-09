import { SPACINGS } from "@/constants/sizes";
import { useUserAccount } from "@/context/UserAccountContext";
import { StyleSheet, View } from "react-native";

export const ItemSeparator = () => {
  const { theme } = useUserAccount();
  return (
    <View style={[styles.separator, { borderColor: theme.surfaceDisabled }]} />
  );
};

const styles = StyleSheet.create({
  separator: {
    borderBottomWidth: 1,
    backgroundColor: "transparent",
    marginLeft: SPACINGS.xxl,
  },
});
