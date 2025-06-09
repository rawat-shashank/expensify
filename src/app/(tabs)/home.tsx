import { Icons } from "@/components/Atoms/Icons";
import Container from "@/components/UI/Container";
import { materialTheme } from "@/constants";
import { TransactionType } from "@/database/transactionSchema";
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
  TouchableOpacity,
} from "react-native";

export default function HomeScreen() {
  console.log("HomeScreen: Component Rendered");
  const db = useSQLiteContext();
  const { profileData } = useProfile(db);
  const { transactions, isLoading: isTransactionsLoading } =
    useTransactions(db);
  const router = useRouter();

  const handleCardPress = (transactionId: number) => {
    router.push(`/transaction/${transactionId}`);
  };

  const renderItem = ({ item }: { item: TransactionType }) => {
    const time = new Date(item.time);
    const transactionTypeStyle =
      item.type === "income" ? styles.income : styles.expense;
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => handleCardPress(item.id)}
      >
        <Icons
          name={item.category_icon}
          variant="circularBackground"
          backgroundColor={item.category_color}
        />
        <View style={styles.leftSection}>
          <Text style={styles.title}>{item.name}</Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 4,
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <Text style={styles.subtitle}>{item.account_name}</Text>
            <Text style={styles.subtitle}>•</Text>
            <Text style={styles.subtitle}>
              {time.toLocaleDateString("en-GB", {
                weekday: "short",
                day: "2-digit",
                month: "short",
              })}
            </Text>
            <Text style={styles.subtitle}>•</Text>
            <Text style={styles.subtitle}>
              {time.toLocaleTimeString("en-GB", {
                timeStyle: "short",
              })}
            </Text>
          </View>
        </View>
        <View style={styles.rightSection}>
          <Text style={[styles.amount, transactionTypeStyle]}>
            {item.type === "expense" ? "-" : "+"}
            {item.amount.toFixed(2)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (isTransactionsLoading) {
    return <ActivityIndicator size={"large"} />;
  }

  return (
    <Container>
      <Text style={styles.title}>{profileData?.name}</Text>
      <Text style={styles.subtitle}>Welcome Back!</Text>
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
    color: materialTheme.onSurfaceVariant,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: materialTheme.onSurface,
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
