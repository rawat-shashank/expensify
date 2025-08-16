import React from "react";
import { StyleSheet, View } from "react-native";

import { SPACINGS } from "@/constants/sizes";
import { useUserAccount } from "@/context/UserAccountContext";

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
  const { theme } = useUserAccount();

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
    paddingHorizontal: SPACINGS.md,
  },
});
