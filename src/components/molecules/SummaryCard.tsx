import { View } from "react-native";

import { SummaryCardType } from "@/database/generalSchema";
import { Text } from "../atoms";
import { FONT_SIZES, SPACINGS } from "@/constants/sizes";
import { useUserAccount } from "@/context/UserAccountContext";

export const SummaryCard = ({
  summaryCardDetails,
}: {
  summaryCardDetails: SummaryCardType;
}) => {
  const { theme } = useUserAccount();
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
        <Text size={FONT_SIZES.small} color={theme.onTertiaryContainer}>
          Total Balance
        </Text>
        <Text
          color={theme.onTertiaryContainer}
          size={FONT_SIZES.h2}
          style={{ fontWeight: "bold" }}
        >
          £{current_balance}
        </Text>
      </View>
      <View style={{ display: "flex", gap: SPACINGS.xs }}>
        <Text size={FONT_SIZES.small} color={theme.onTertiaryContainer}>
          Total
        </Text>
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
              style={{ fontWeight: "bold" }}
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
              style={{ fontWeight: "bold" }}
            >
              £{total_expense}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
