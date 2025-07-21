import { useTheme } from "@/context/ThemeContext";
import { ReactNode } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

interface ButtonProps {
  children: ReactNode;
  onPress: () => void;
  variant?: "basic" | "submit";
  style?: {};
}

const TouchableButton = ({
  children,
  style,
  onPress,
  variant = "basic",
}: ButtonProps) => {
  const { theme } = useTheme();
  switch (variant) {
    case "submit":
      return (
        <TouchableOpacity
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
    <TouchableOpacity style={style} onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  submitButton: {
    paddingVertical: 15,
    borderRadius: 32,
    alignItems: "center",
  },
});

export { TouchableButton };
