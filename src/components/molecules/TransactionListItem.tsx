import { StyleSheet, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { TransactionDetaillsType } from "@/database/transactionSchema";
import { Text } from "../atoms";

export const TransactionListItem = ({
  item,
}: {
  item: TransactionDetaillsType;
}) => {
  const { theme } = useTheme();
  const time = new Date(item.time);

  return (
    <View style={styles.itemContainer}>
      <View>
        <Text color={theme.onSurface} style={styles.title}>
          {item.name}
        </Text>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 4,
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <Text size={13} color={theme.onSurfaceVariant}>
            {item.account_name}
          </Text>
          <Text size={13} color={theme.onSurfaceVariant}>
            •
          </Text>

          <Text size={13} color={theme.onSurfaceVariant}>
            {time.toLocaleDateString("en-GB", {
              weekday: "short",
              day: "2-digit",
              month: "short",
            })}
          </Text>
          <Text size={13} color={theme.onSurfaceVariant}>
            •
          </Text>
          <Text size={13} color={theme.onSurfaceVariant}>
            {time.toLocaleTimeString("en-GB", {
              timeStyle: "short",
            })}
          </Text>
        </View>
      </View>
      <View>
        <Text
          size={18}
          style={styles.amount}
          color={item.type === "income" ? "green" : theme.error}
        >
          £{item.amount}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    gap: 16,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  amount: {
    fontWeight: "bold",
    textAlign: "right",
  },
});
