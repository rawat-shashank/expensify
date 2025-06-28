import { useTheme } from "@/context/ThemeContext";
import { View } from "react-native";

export const ColorDotWithRing = ({
  size = 24,
  color,
  outline = false,
}: {
  size?: number;
  color: string;
  outline?: boolean;
}) => {
  const { theme } = useTheme();
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 2,
        borderColor: color,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: size - 4,
          height: size - 4,
          borderRadius: (size - 4) / 2,
          backgroundColor: "transparent",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {!outline && (
          <View
            style={{
              width: size - 8,
              height: size - 8,
              borderRadius: (size - 8) / 2,
              backgroundColor: color || theme.onPrimary,
            }}
          />
        )}
      </View>
    </View>
  );
};
