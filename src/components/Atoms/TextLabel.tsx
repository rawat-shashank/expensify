import { useTheme } from "@/context/ThemeContext";
import { Text } from "react-native";

interface TextLabelProps {
  label: string;
}
export const TextLabel = ({ label }: TextLabelProps) => {
  const { theme } = useTheme();
  return (
    <Text
      style={{
        color: theme.tertiary,
        fontSize: 16,
        marginBottom: 16,
        fontWeight: "bold",
      }}
    >
      {label}
    </Text>
  );
};
