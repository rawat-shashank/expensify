import { ReactNode } from "react";
import { Text as TextLabel, TextStyle } from "react-native";

interface TextLabelProps {
  children: ReactNode;
  size?: number;
  style?: TextStyle;
}

export const Text = ({ children, style, size = 16 }: TextLabelProps) => {
  return <TextLabel style={[style, { fontSize: size }]}>{children}</TextLabel>;
};
