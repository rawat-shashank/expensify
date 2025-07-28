import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { BlurView } from "expo-blur";

import { useTheme } from "@/context/ThemeContext";
import {
  AccountCardTypeEnum,
  AccountSummaryType,
} from "@/database/accountsSchema";
import { Icons, Text } from "../atoms";
import { WINDOW_WIDTH } from "@/constants";

const AccountCard = ({
  account,
  handleCardPress,
  handleDeleteAccount,
}: {
  account: AccountSummaryType;
  handleCardPress: (id: number) => void;
  handleDeleteAccount: (id: number) => void;
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      onPress={() => handleCardPress(account.id)}
      style={{
        width: WINDOW_WIDTH - 32,
      }}
    >
      <BlurView
        intensity={60}
        tint="light"
        experimentalBlurMethod="dimezisBlurView"
        style={[
          styles.card,
          {
            paddingHorizontal: 16,
            overflow: "hidden",
            borderColor: theme.onBackground,
            borderWidth: 2,
            backgroundColor: account.color,
          },
        ]}
      >
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
              <Text style={styles.cardTitle}>{account.accountName}</Text>
              <Text size={12}>{account.name}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => handleDeleteAccount(account.id)}>
            <Icons name="delete" />
          </TouchableOpacity>
        </View>
        <View style={{ marginVertical: 12 }}>
          <Text style={styles.cardSubTitle}>Total Balance</Text>
          <Text style={styles.amount}>£{account.current_balance}</Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 16,
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexGrow: 1,
              marginBottom: 8,
            }}
          >
            <Text style={styles.cardSubTitle}>Income</Text>
            <Text
              color="green"
              size={24}
              style={{
                fontWeight: "bold",
              }}
            >
              £{account.total_income}
            </Text>
          </View>
          <View style={{ flexGrow: 1 }}>
            <Text style={styles.cardSubTitle}>Expenses</Text>
            <Text
              color="red"
              size={24}
              style={{
                fontWeight: "bold",
              }}
            >
              £{account.total_expense}
            </Text>
          </View>
        </View>
      </BlurView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
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
    fontWeight: "bold",
  },
  cardSubTitle: {
    fontSize: 12,
  },
  amount: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  income: {
    color: "green",
  },
  expense: {
    color: "red",
  },
});

export default AccountCard;
