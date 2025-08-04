import { FONT_SIZES } from "@/constants";
import { ReactNode } from "react";
import { Text as TextLabel, TextStyle } from "react-native";

interface TextLabelProps {
  children: ReactNode;
  size?: number;
  style?: TextStyle;
  color?: string;
}

export const Text = ({
  children,
  style,
  color,
  size = FONT_SIZES.body,
}: TextLabelProps) => {
  return (
    <TextLabel style={[style, { fontSize: size, color }]}>{children}</TextLabel>
  );
};
