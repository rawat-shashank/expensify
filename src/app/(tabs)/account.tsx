import React, { useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import useAccounts from "@/queries/useAccounts";
import { useSQLiteContext } from "expo-sqlite";
import { useFocusEffect, useRouter } from "expo-router";
import { AccountType } from "@/database/accountsSchema";
import AccountCard from "@/components/AccountCard";
import alert from "@/components/Alert";
import useTransactions from "@/queries/useTransactions";

const AccountList = () => {
  const db = useSQLiteContext();
  if (!db) {
    return <Text>Database not ready.</Text>;
  }
  const {
    accounts,
    isLoading: isAccountLoading,
    deleteAccount,
  } = useAccounts(db);
  const { transactions } = useTransactions(db);
  const router = useRouter();

  const handleCardPress = (accountId: number) => {
    router.push(`/account/${accountId}`);
  };

  const handleDeleteAccount = (accountId: number) => {
    if (accountId) {
      alert("Delete Account", `Are you sure you want to delete the account ?`, [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => {},
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteAccount(accountId);
          },
        },
      ]);
    }
  };

  //FIX: UI need to be updated later
  const renderItem = ({ item }: { item: AccountType }) => (
    <AccountCard
      item={item}
      transactions={transactions.filter(
        (transaction) => transaction.account_id === item.id,
      )}
      handleCardPress={handleCardPress}
      handleDeleteAccount={handleDeleteAccount}
    />
  );

  if (isAccountLoading) {
    return <ActivityIndicator size={"large"} />;
  }

  return (
    <View style={styles.container}>
      {accounts && accounts.length > 0 ? (
        <FlatList
          initialNumToRender={2}
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
    paddingVertical: 16,
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
