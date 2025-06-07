import { materialTheme } from "@/constants";
import { ReactNode } from "react";
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";

interface ButtonProps {
  children: ReactNode;
  onPress: () => void;
  variant?: "basic" | "submit";
  style?: ViewStyle;
}

const TouchableButton = ({
  children,
  style,
  onPress,
  variant = "basic",
}: ButtonProps) => {
  switch (variant) {
    case "submit":
      return (
        <TouchableOpacity
          style={[styles.submitButton, style]}
          onPress={onPress}
        >
          {children}
        </TouchableOpacity>
      );
    case "basic":
    default:
      break;
  }
  return (
    <TouchableOpacity style={style} onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  submitButton: {
    backgroundColor: materialTheme.primary,
    paddingVertical: 15,
    borderRadius: 32,
    alignItems: "center",
  },
});

export { TouchableButton };
