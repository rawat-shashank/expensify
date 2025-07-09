import { useTheme } from "@/context/ThemeContext";
import { SummaryCardType } from "@/database/generalSchema";
import { Text, View } from "react-native";

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
        <Text style={{ color: theme.onTertiaryContainer }}>Total Balance</Text>
        <Text style={{ color: theme.onTertiaryContainer, fontSize: 24 }}>
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
            <Text style={{ color: theme.onTertiaryContainer, fontSize: 12 }}>
              Income
            </Text>
            <Text style={{ color: theme.onTertiaryContainer, fontSize: 16 }}>
              £{total_income}
            </Text>
          </View>

          <View style={{ flexGrow: 1 }}>
            <Text style={{ color: theme.onTertiaryContainer, fontSize: 12 }}>
              Expense
            </Text>
            <Text style={{ color: theme.onTertiaryContainer, fontSize: 16 }}>
              £{total_expense}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
