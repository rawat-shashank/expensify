import { TransactionTypeExtra } from "@/database/transactionSchema";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Icons } from "../Atoms/Icons";
import { useTheme } from "@/context/ThemeContext";

export const TransactionListItem = ({
  item,
  onPress,
}: {
  item: TransactionTypeExtra;
  onPress: (id: number) => void;
}) => {
  const { theme } = useTheme();
  const time = new Date(item.time);

  const transactionTypeStyle =
    item.type === "income" ? styles.income : styles.expense;

  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => onPress(item.id)}
    >
      <Icons
        name={item.category_icon}
        variant="circularBackground"
        backgroundColor={item.category_color}
      />
      <View style={styles.leftSection}>
        <Text
          style={[
            styles.title,
            {
              color: theme.onSurface,
            },
          ]}
        >
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
          <Text style={[styles.subtitle, { color: theme.onSurfaceVariant }]}>
            {item.account_name}
          </Text>
          <Text style={[styles.subtitle, { color: theme.onSurfaceVariant }]}>
            •
          </Text>
          <Text style={[styles.subtitle, { color: theme.onSurfaceVariant }]}>
            {time.toLocaleDateString("en-GB", {
              weekday: "short",
              day: "2-digit",
              month: "short",
            })}
          </Text>
          <Text style={[styles.subtitle, { color: theme.onSurfaceVariant }]}>
            •
          </Text>
          <Text style={[styles.subtitle, { color: theme.onSurfaceVariant }]}>
            {time.toLocaleTimeString("en-GB", {
              timeStyle: "short",
            })}
          </Text>
        </View>
      </View>
      <View style={styles.rightSection}>
        <Text style={[styles.amount, transactionTypeStyle]}>
          £{item.amount}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    gap: 16,
  },
  leftSection: {
    flex: 1,
  },
  subtitle: {
    fontSize: 13,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: "#777",
    marginBottom: 3,
  },
  category: {
    fontSize: 14,
    color: "#555",
    marginBottom: 3,
  },
  account: {
    fontSize: 14,
    color: "#555",
    marginBottom: 3,
  },
  description: {
    fontSize: 14,
    color: "#888",
  },
  rightSection: {
    marginLeft: 15,
  },
  amount: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
  },
  income: {
    color: "green",
  },
  expense: {
    color: "red",
  },
});
