import { ReactNode } from "react";
import { Text as TextLabel, TextStyle } from "react-native";

interface TextLabelProps {
  children: ReactNode;
  size?: number;
  style?: TextStyle;
  color?: string;
}

export const Text = ({ children, style, color, size = 16 }: TextLabelProps) => {
  return (
    <TextLabel style={[style, { fontSize: size, color }]}>{children}</TextLabel>
  );
};
