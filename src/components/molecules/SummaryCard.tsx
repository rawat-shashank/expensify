import { View } from "react-native";
import { useTheme } from "@/context/ThemeContext";

import { SummaryCardType } from "@/database/generalSchema";
import { Text } from "../atoms";
import { FONT_SIZES, SPACINGS } from "@/constants/sizes";

export const SummaryCard = ({
  summaryCardDetails,
}: {
  summaryCardDetails: SummaryCardType;
}) => {
  const { theme } = useTheme();
  const { current_balance, total_income, total_expense } = summaryCardDetails;

  return (
    <View
      style={{
        backgroundColor: theme.tertiaryContainer,
        borderRadius: SPACINGS.md,
        paddingHorizontal: SPACINGS.md,
        paddingVertical: SPACINGS.md,
        marginVertical: SPACINGS.md,
        gap: SPACINGS.xl,
      }}
    >
      <View style={{ display: "flex", gap: SPACINGS.xs }}>
        <Text color={theme.onTertiaryContainer}>Total Balance</Text>
        <Text
          color={theme.onTertiaryContainer}
          size={FONT_SIZES.h3}
          style={{ fontWeight: "bold" }}
        >
          £{current_balance}
        </Text>
      </View>
      <View style={{ display: "flex", gap: SPACINGS.xs }}>
        <Text>Total</Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexGrow: 1 }}>
            <Text size={FONT_SIZES.caption} color={theme.onTertiaryContainer}>
              Income
            </Text>
            <Text
              size={FONT_SIZES.subheading}
              color={theme.onTertiaryContainer}
            >
              £{total_income}
            </Text>
          </View>

          <View style={{ flexGrow: 1 }}>
            <Text size={FONT_SIZES.caption} color={theme.onTertiaryContainer}>
              Expense
            </Text>
            <Text
              size={FONT_SIZES.subheading}
              color={theme.onTertiaryContainer}
            >
              £{total_expense}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
