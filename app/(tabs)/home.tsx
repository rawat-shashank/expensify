import Container from "@/components/UI/Container";
import colors from "@/constants/colors";
import { TransactionType } from "@/database/transactionSchema";
import useProfile from "@/hooks/useProfile";
import useTransactions from "@/hooks/useTransactions";
import { useFocusEffect, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";

export default function HomeScreen() {
  const db = useSQLiteContext();
  const { profileData } = useProfile(db);
  const { transactions, fetchTransactions, loading } = useTransactions(db);
  const [profileName, setProfileName] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (profileData) {
      setProfileName(profileData.name);
    }
  }, [profileData]);

  useFocusEffect(
    useCallback(() => {
      fetchTransactions();
      return () => {};
    }, [fetchTransactions]),
  );

  const handleCardPress = (transactionId: number) => {
    router.push(`/transaction/${transactionId}`);
  };

  const renderItem = ({ item }: { item: TransactionType }) => {
    const transactionTypeStyle =
      item.type === "income" ? styles.income : styles.expense;
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => handleCardPress(item.id)}
      >
        <View style={styles.leftSection}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.date}>{item.transaction_date}</Text>
          {item.category_id && (
            <Text style={styles.category}>Category: {item.category_id}</Text>
          )}
          {item.account_id && (
            <Text style={styles.account}>Account: {item.account_id}</Text>
          )}
          {item.description && (
            <Text style={styles.description}>{item.description}</Text>
          )}
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

  if (loading) {
    return <ActivityIndicator size={"large"} />;
  }

  return (
    <Container>
      <Text style={styles.title}>{profileName}</Text>
      <Text style={styles.subtitle}>Welcome Back!</Text>
      <View style={styles.container}>
        {transactions && transactions.length > 0 ? (
          <FlatList
            data={transactions}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.flatListContent}
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
  flatListContent: {
    paddingHorizontal: 16,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  leftSection: {
    flex: 1,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    color: colors.textPrimary,
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
