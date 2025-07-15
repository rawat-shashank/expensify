import { View, FlatList } from "react-native";
import { useRouter } from "expo-router";

import {
  TransactionsGroupedByDateType,
  TransactionDetaillsType,
} from "@/database/transactionSchema";
import { TransactionListItem } from "../Molecules/TransactionListItem";
import { useTheme } from "@/context/ThemeContext";
import { Text } from "../atoms";

export const TransactionsGroupedByDate = ({
  transactionsGroupedByDate,
}: {
  transactionsGroupedByDate: TransactionsGroupedByDateType;
}) => {
  const { theme } = useTheme();
  const router = useRouter();
  const dates: string[] = Object.keys(transactionsGroupedByDate || []) || [];

  const handleCardPress = (transactionId: number) => {
    router.push(`/transaction/${transactionId}`);
  };

  const renderItem = ({ item }: { item: TransactionDetaillsType }) => (
    <TransactionListItem item={item} onPress={handleCardPress} />
  );

  return (
    <View>
      {dates.map((date) => {
        const time = new Date(date);

        const transactionTypeStyle =
          transactionsGroupedByDate[date].total_amount > 0
            ? { color: "green" }
            : { color: "red" };
        return (
          <View key={date} style={{ marginVertical: 8 }}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text size={13} color={theme.onBackground}>
                {time.toLocaleDateString("en-GB", {
                  weekday: "short",
                  day: "2-digit",
                  month: "short",
                  year: "2-digit",
                })}
              </Text>
              <Text style={transactionTypeStyle}>
                £{transactionsGroupedByDate[date].total_amount}
              </Text>
            </View>
            <View>
              {transactionsGroupedByDate[date].transactions &&
              transactionsGroupedByDate[date].transactions.length > 0 ? (
                <FlatList
                  data={transactionsGroupedByDate[date].transactions}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.id.toString()}
                />
              ) : (
                <Text>No transactions created yet.</Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
};
