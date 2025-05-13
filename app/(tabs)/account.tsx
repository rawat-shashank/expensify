import React, { useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import useAccounts from "@/hooks/useAccounts";
import { useSQLiteContext } from "expo-sqlite";
import { useFocusEffect, useRouter } from "expo-router";

interface Account {
  id: number;
  title: string;
  accountName: string;
  amount: number;
  defaultAccount: boolean;
  type: "cash" | "wallet" | "bank";
  createdAt?: string;
}

const AccountList = () => {
  const db = useSQLiteContext();
  if (!db) {
    return <Text>Database not ready.</Text>;
  }
  const { accounts, loading, fetchAccounts } = useAccounts(db);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      fetchAccounts();
      return () => {};
    }, [fetchAccounts]),
  );

  const handleCardPress = (accountId: number) => {
    router.push(`/account/${accountId}`);
  };

  //FIX: UI need to be updated later
  const renderItem = ({ item }: { item: Account }) => (
    <TouchableOpacity onPress={() => handleCardPress(item.id)}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          {item.type === "bank" && <View style={styles.bankIcon} />}
          {item.type === "wallet" && <View style={styles.walletIcon} />}
          {item.type === "cash" && <View style={styles.cashIcon} />}
        </View>
        <Text style={styles.accountName}>{item.accountName}</Text>
        <Text style={styles.amount}>£{item.amount.toFixed(2)}</Text>
        {item.createdAt && (
          <Text style={styles.dateCreated}>{item.createdAt}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size={"large"} />;
  }

  return (
    <View style={styles.container}>
      {accounts && accounts.length > 0 ? (
        <FlatList
          data={accounts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
        />
      ) : (
        <Text>No accounts created yet.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  flatListContent: {
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    padding: 16,
    marginRight: 16,
    width: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  accountName: {
    fontSize: 16,
    color: "#555",
    marginBottom: 12,
  },
  amount: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  dateCreated: {
    fontSize: 12,
    color: "#777",
  },
  bankIcon: {
    width: 20,
    height: 20,
    borderRadius: 5,
    backgroundColor: "#4CAF50",
  },
  walletIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#2196F3",
  },
  cashIcon: {
    width: 20,
    height: 20,
    borderRadius: 2,
    backgroundColor: "#FF9800",
  },
});

export default AccountList;
