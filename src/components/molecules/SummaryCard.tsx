import { View } from "react-native";
import { useTheme } from "@/context/ThemeContext";

import { SummaryCardType } from "@/database/generalSchema";
import { Text } from "../atoms";

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
        borderRadius: 16,
        paddingHorizontal: 8,
        paddingVertical: 16,
        gap: 32,
        marginVertical: 16,
      }}
    >
      <View>
        <Text color={theme.onTertiaryContainer}>Total Balance</Text>
        <Text color={theme.onTertiaryContainer} size={24}>
          £{current_balance}
        </Text>
      </View>
      <View style={{ display: "flex", gap: 8 }}>
        <Text>Total</Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexGrow: 1 }}>
            <Text size={12} color={theme.onTertiaryContainer}>
              Income
            </Text>
            <Text size={16} color={theme.onTertiaryContainer}>
              £{total_income}
            </Text>
          </View>

          <View style={{ flexGrow: 1 }}>
            <Text size={12} color={theme.onTertiaryContainer}>
              Expense
            </Text>
            <Text size={16} color={theme.onTertiaryContainer}>
              £{total_expense}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
