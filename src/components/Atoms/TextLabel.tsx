import { materialTheme } from "@/constants";
import { Text } from "react-native";

interface TextLabelProps {
  label: string;
}
export const TextLabel = ({ label }: TextLabelProps) => (
  <Text
    style={{
      color: materialTheme.tertiary,
      fontSize: 16,
      marginBottom: 16,
      fontWeight: "bold",
    }}
  >
    {label}
  </Text>
);
