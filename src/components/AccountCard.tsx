import { WINDOW_WIDTH } from "@/constants";
import { AccountType } from "@/database/accountsSchema";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Icons } from "./Icons";
import { TransactionType } from "@/database/transactionSchema";
import { FlatList } from "react-native-gesture-handler";
import TransactionList from "./TransactionList";

const AccountCard = ({
  item,
  transactions,
  handleCardPress,
  handleDeleteAccount,
}: {
  item: AccountType;
  transactions: TransactionType[];
  handleCardPress: (id: number) => void;
  handleDeleteAccount: (id: number) => void;
}) => {
  const handleTransactionPress = (id: number) => {
    console.log(id);
  };

  const renderItem = ({ item }: { item: TransactionType }) => {
    return (
      <TransactionList
        item={item}
        handleTransactionPress={handleTransactionPress}
      />
    );
  };

  return (
    <View style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <TouchableOpacity
        onPress={() => handleCardPress(item.id)}
        style={{
          width: WINDOW_WIDTH * 0.9,
        }}
      >
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "8px",
                alignItems: "center",
              }}
            >
              {item.type === "bank" && <Icons name="bank" />}
              {item.type === "wallet" && <Icons name="wallet-outline" />}
              {item.type === "cash" && <Icons name="cash-outline" />}
              <View style={styles.names}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSubTitle}>{item.title}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => handleDeleteAccount(item.id)}>
              <Icons name="delete" />
            </TouchableOpacity>
          </View>
          <View style={{ marginVertical: 12 }}>
            <Text style={styles.cardSubTitle}>Total Balance</Text>
            <Text style={styles.amount}>£{item.amount.toFixed(2)}</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <View style={{ flexGrow: 1 }}>
              <Text style={styles.cardSubTitle}>Income</Text>
              <Text style={styles.amount}>£{item.amount.toFixed(2)}</Text>
            </View>
            <View style={{ flexGrow: 1 }}>
              <Text style={styles.cardSubTitle}>Expenses</Text>
              <Text style={styles.amount}>£{item.amount.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <View>
        {transactions && transactions.length > 0 ? (
          <FlatList
            data={transactions}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
          />
        ) : (
          <Text>No transactions created yet.</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    padding: 16,
    marginRight: 16,
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
  names: {
    display: "flex",
    flexDirection: "column",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cardSubTitle: {
    fontSize: 12,
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

export default AccountCard;
