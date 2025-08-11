import { Container, Text } from "@/components";
import { FONT_SIZES } from "@/constants";
import { useUserAccount } from "@/context/UserAccountContext";

const Overview = () => {
  const { theme } = useUserAccount();
  return (
    <Container>
      <Text size={FONT_SIZES.h1} color={theme.onSurface}>
        Coming soon
      </Text>
    </Container>
  );
};

export default Overview;
