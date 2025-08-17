import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import {
  AccountCardTypeEnum,
  AccountSummaryType,
} from "@/database/accountsSchema";

import { FONT_SIZES, SPACINGS, WINDOW_WIDTH } from "@/constants/sizes";
import { useUserAccount } from "@/context/UserAccountContext";

import { Icons, Text } from "@/components/atoms";
import BlurCard from "../organisms/BlurCard";

export const AccountCard = ({
  account,
  handleCardPress,
  handleDeleteAccount,
}: {
  account: AccountSummaryType;
  handleCardPress: (id: number) => void;
  handleDeleteAccount: (id: number) => void;
}) => {
  const { theme, colorScheme } = useUserAccount();

  return (
    <TouchableOpacity
      onPress={() => handleCardPress(account.id)}
      style={{
        width: WINDOW_WIDTH - SPACINGS.xl,
      }}
      activeOpacity={1}
    >
      <BlurCard backgroundColor={account.color} colorScheme={colorScheme}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: SPACINGS.md,
                alignItems: "center",
              }}
            >
              {account.cardType === AccountCardTypeEnum.BANK && (
                <Icons name="bank" color={theme.onSurface} />
              )}
              {account.cardType === AccountCardTypeEnum.WALLET && (
                <Icons name="wallet-outline" color={theme.onSurface} />
              )}
              {account.cardType === AccountCardTypeEnum.CASH && (
                <Icons name="cash-outline" color={theme.onSurface} />
              )}
              <View style={styles.names}>
                <Text
                  color={theme.onSurface}
                  size={FONT_SIZES.small}
                  style={styles.cardTitle}
                >
                  {account.accountName}
                </Text>
                <Text color={theme.onSurface} size={FONT_SIZES.caption}>
                  {account.name}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => handleDeleteAccount(account.id)}>
              <Icons color={theme.onSurface} name="delete" />
            </TouchableOpacity>
          </View>
          <View>
            <Text color={theme.onSurface} size={FONT_SIZES.small}>
              Total Balance
            </Text>
            <Text
              color={theme.onSurface}
              size={FONT_SIZES.h2}
              style={styles.amount}
            >
              £{account.current_balance}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: SPACINGS.md,
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexGrow: 1,
                marginBottom: SPACINGS.xs,
              }}
            >
              <Text color={theme.onSurface} size={FONT_SIZES.caption}>
                Income
              </Text>
              <Text
                color={theme.onSurface}
                size={FONT_SIZES.subheading}
                style={{
                  fontWeight: "bold",
                }}
              >
                £{account.total_income}
              </Text>
            </View>
            <View style={{ flexGrow: 1 }}>
              <Text color={theme.onSurface} size={FONT_SIZES.caption}>
                Expenses
              </Text>
              <Text
                color={theme.onSurface}
                size={FONT_SIZES.subheading}
                style={{
                  fontWeight: "bold",
                }}
              >
                £{account.total_expense}
              </Text>
            </View>
          </View>
        </View>
      </BlurCard>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: SPACINGS.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    padding: SPACINGS.md,
    overflow: "hidden",
    display: "flex",
    gap: SPACINGS.md,
    backgroundColor: "transparent",
    width: "100%",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  names: {
    display: "flex",
    flexDirection: "column",
  },
  cardTitle: {
    fontWeight: "bold",
  },
  amount: {
    fontWeight: "bold",
  },
});
