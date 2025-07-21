import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BlurView } from "expo-blur";

import { useTheme } from "@/context/ThemeContext";
import { WINDOW_WIDTH } from "@/constants";
import {
  AccountCardTypeEnum,
  AccountSummaryType,
} from "@/database/accountsSchema";
import { Icons } from "../atoms";

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
    <View style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <TouchableOpacity
        onPress={() => handleCardPress(account.id)}
        style={{
          width: WINDOW_WIDTH * 0.8,
        }}
      >
        <View
          style={[
            {
              backgroundColor: `rgba(255, 255, 255, 0.2)`,
              marginRight: 16,
              borderRadius: 16,
              overflow: "hidden",
            },
          ]}
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
                £{account.current_balance}
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
                <Text style={[styles.amount, styles.income]}>
                  £{account.total_income}
                </Text>
              </View>
              <View style={{ flexGrow: 1 }}>
                <Text style={styles.cardSubTitle}>Expenses</Text>
                <Text style={[styles.amount, styles.expense]}>
                  £{account.total_expense}
                </Text>
              </View>
            </View>
          </BlurView>
        </View>
      </TouchableOpacity>
    </View>
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
  income: {
    color: "green",
  },
  expense: {
    color: "red",
  },
});

export default AccountCard;
