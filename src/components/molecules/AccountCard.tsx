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
import { FONT_SIZES, SPACINGS } from "@/constants/sizes";

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
        width: WINDOW_WIDTH - SPACINGS.xl,
      }}
    >
      <BlurView
        intensity={60}
        tint="light"
        experimentalBlurMethod="dimezisBlurView"
        style={[
          styles.card,
          {
            borderColor: theme.onBackground,
            backgroundColor: account.color,
          },
        ]}
      >
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
              <Text size={FONT_SIZES.caption}>{account.name}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => handleDeleteAccount(account.id)}>
            <Icons name="delete" />
          </TouchableOpacity>
        </View>
        <View>
          <Text size={FONT_SIZES.caption}>Total Balance</Text>
          <Text size={FONT_SIZES.h4} style={styles.amount}>
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
            <Text size={FONT_SIZES.caption}>Income</Text>
            <Text
              size={FONT_SIZES.subheading}
              style={{
                fontWeight: "bold",
              }}
            >
              £{account.total_income}
            </Text>
          </View>
          <View style={{ flexGrow: 1 }}>
            <Text size={FONT_SIZES.caption}>Expenses</Text>
            <Text
              size={FONT_SIZES.subheading}
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
    borderWidth: 2,
    borderRadius: SPACINGS.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    padding: SPACINGS.md,
    overflow: "hidden",
    display: "flex",
    gap: SPACINGS.md,
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

export default AccountCard;
