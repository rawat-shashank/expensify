import {
  TransactionGroupedByDate,
  TransactionTypeExtra,
} from "@/database/transactionSchema";
import { Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { TransactionListItem } from "../Molecules/TransactionListItem";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";

export const TransactionsGroupedByDate = ({
  transactionsGroupedByDate,
}: {
  transactionsGroupedByDate: TransactionGroupedByDate;
}) => {
  const { theme } = useTheme();
  const router = useRouter();
  const dates: string[] = Object.keys(transactionsGroupedByDate) || [];

  const handleCardPress = (transactionId: number) => {
    router.push(`/transaction/${transactionId}`);
  };

  const renderItem = ({ item }: { item: TransactionTypeExtra }) => (
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
              <Text style={{ color: theme.onBackground, fontSize: 13 }}>
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
