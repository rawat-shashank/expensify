import { ReactNode } from "react";
import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";

import { SPACINGS } from "@/constants/sizes";
import { useUserAccount } from "@/context/UserAccountContext";

interface ButtonProps {
  children: ReactNode;
  onPress: () => void;
  variant?: "basic" | "submit";
  style?: ViewStyle;
  disabled?: boolean;
}

const TouchableButton = ({
  children,
  style,
  onPress,
  variant = "basic",
  disabled = false,
}: ButtonProps) => {
  const { theme } = useUserAccount();
  switch (variant) {
    case "submit":
      return (
        <TouchableOpacity
          disabled={disabled}
          style={[
            styles.submitButton,
            style,
            {
              backgroundColor: theme.primary,
            },
          ]}
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
    <TouchableOpacity disabled={disabled} style={style} onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  submitButton: {
    paddingVertical: SPACINGS.md,
    borderRadius: SPACINGS.xl,
    alignItems: "center",
  },
});

export { TouchableButton };
