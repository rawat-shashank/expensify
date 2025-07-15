import { useTheme } from "@/context/ThemeContext";
import { Text } from "../atoms";

interface TextLabelProps {
  label: string;
}
export const TextLabel = ({ label }: TextLabelProps) => {
  const { theme } = useTheme();
  return (
    <Text
      color={theme.tertiary}
      style={{
        marginBottom: 16,
        fontWeight: "bold",
      }}
    >
      {label}
    </Text>
  );
};
