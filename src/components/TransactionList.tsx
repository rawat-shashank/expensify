import { WINDOW_WIDTH } from "@/constants";
import { colors } from "@/constants/colors";
import { TransactionType } from "@/database/transactionSchema";
import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";

const TransactionList = ({
  item,
  handleTransactionPress,
}: {
  item: TransactionType;
  handleTransactionPress: (id: number) => void;
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => handleTransactionPress(item.id)}
    >
      <Text style={{ color: colors.textPrimary }}>Icon</Text>
      <View
        style={{
          marginLeft: 8,
          borderBottomWidth: 1,
          borderBottomColor: colors.accrentBg,
          paddingBottom: 16,
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View>
          <Text style={{ color: colors.textPrimary }}>{item.title}</Text>
          <Text style={{ color: colors.textPrimary }}>
            {item.transaction_date}
          </Text>
        </View>
        <View>
          <Text
            style={{
              color: item.type === "income" ? colors.income : colors.expense,
            }}
          >
            {item.type === "expense" ? "-" : "+"}
            {item.amount}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 8,
    width: WINDOW_WIDTH * 0.9 - 16,
  },
});

export default TransactionList;
