import { TransactionListItem } from "@/components/Molecules/TransactionListItem";
import Container from "@/components/UI/Container";
import { useTheme } from "@/context/ThemeContext";
import { TransactionTypeExtra } from "@/database/transactionSchema";
import useProfile from "@/queries/useProfile";
import useTransactions from "@/queries/useTransactions";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  FlatList,
} from "react-native";

export default function HomeScreen() {
  const { theme } = useTheme();
  const db = useSQLiteContext();
  const { profileData } = useProfile(db);
  const { transactions, isLoading: isTransactionsLoading } =
    useTransactions(db);
  const router = useRouter();

  const handleCardPress = (transactionId: number) => {
    router.push(`/transaction/${transactionId}`);
  };

  const renderItem = ({ item }: { item: TransactionTypeExtra }) => (
    <TransactionListItem item={item} onPress={handleCardPress} />
  );

  if (isTransactionsLoading) {
    return <ActivityIndicator size={"large"} />;
  }

  return (
    <Container>
      <Text style={[styles.title, { color: theme.onSurface }]}>
        {profileData?.name}
      </Text>
      <Text style={[styles.subtitle, { color: theme.onSurface }]}>
        Welcome Back!
      </Text>
      <View style={styles.container}>
        {transactions && transactions.length > 0 ? (
          <FlatList
            data={transactions}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
          />
        ) : (
          <Text>No transactions created yet.</Text>
        )}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    gap: 16,
  },
  leftSection: {
    flex: 1,
  },
  subtitle: {
    fontSize: 13,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: "#777",
    marginBottom: 3,
  },
  category: {
    fontSize: 14,
    color: "#555",
    marginBottom: 3,
  },
  account: {
    fontSize: 14,
    color: "#555",
    marginBottom: 3,
  },
  description: {
    fontSize: 14,
    color: "#888",
  },
  rightSection: {
    marginLeft: 15,
  },
  amount: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
  },
  income: {
    color: "green",
  },
  expense: {
    color: "red",
  },
});
