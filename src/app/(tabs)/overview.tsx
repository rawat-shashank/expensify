import { Container, Text } from "@/components";
import { FONT_SIZES } from "@/constants";
import { useTheme } from "@/context/ThemeContext";

export default function Overview() {
  const { theme } = useTheme();
  return (
    <Container>
      <Text size={FONT_SIZES.h1} color={theme.onSurface}>
        {" "}
        Coming soon{" "}
      </Text>
    </Container>
  );
}
