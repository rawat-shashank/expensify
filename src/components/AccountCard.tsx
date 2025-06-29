import { WINDOW_WIDTH } from "@/constants";
import { AccountCardTypeEnum, AccountType } from "@/database/accountsSchema";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Icons } from "./Atoms/Icons";
import { useTheme } from "@/context/ThemeContext";

const AccountCard = ({
  account,
  handleCardPress,
  handleDeleteAccount,
}: {
  account: AccountType;
  handleCardPress: (id: number) => void;
  handleDeleteAccount: (id: number) => void;
}) => {
  const { theme } = useTheme();
  return (
    <View style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <TouchableOpacity
        onPress={() => handleCardPress(account.id)}
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
                gap: 16,
                alignItems: "center",
              }}
            >
              {account.cardType === AccountCardTypeEnum.BANK && (
                <Icons name="bank" />
              )}
              {account.cardType === AccountCardTypeEnum.WALLET && (
                <Icons name="wallet-outline" />
              )}
              {account.cardType === AccountCardTypeEnum.CASH && (
                <Icons name="cash-outline" color={theme.onPrimary} />
              )}
              <View style={styles.names}>
                <Text style={[styles.cardTitle, { color: theme.onPrimary }]}>
                  {account.accountName}
                </Text>
                <Text
                  style={[
                    styles.cardSubTitle,
                    {
                      color: theme.onSecondary,
                    },
                  ]}
                >
                  {account.name}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => handleDeleteAccount(account.id)}>
              <Icons name="delete" color={theme.onPrimary} />
            </TouchableOpacity>
          </View>
          <View style={{ marginVertical: 12 }}>
            <Text style={styles.cardSubTitle}>Total Balance</Text>
            <Text
              style={[
                styles.amount,
                {
                  color: theme.onPrimary,
                },
              ]}
            >
              £{account.amount}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 16,
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexGrow: 1 }}>
              <Text style={styles.cardSubTitle}>Income</Text>
              <Text style={styles.amount}>£{account.amount}</Text>
            </View>
            <View style={{ flexGrow: 1 }}>
              <Text style={styles.cardSubTitle}>Expenses</Text>
              <Text style={styles.amount}>£{account.amount}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#e0e0e0",
    borderRadius: 16,
    paddingHorizontal: 16,
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingTop: 16,
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
  amount: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
});

export default AccountCard;
