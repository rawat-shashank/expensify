import { StyleSheet, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { TransactionDetaillsType } from "@/database/transactionSchema";
import { Text } from "../atoms";
import { FONT_SIZES, SPACINGS } from "@/constants/sizes";

export const TransactionListItem = ({
  item,
}: {
  item: TransactionDetaillsType;
}) => {
  const { theme } = useTheme();
  const time = new Date(item.time);

  return (
    <View style={styles.itemContainer}>
      <View
        style={{
          flex: 1,
          maxWidth: "75%",
        }}
      >
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text
            size={FONT_SIZES.small}
            color={theme.onSurface}
            style={styles.title}
          >
            {item.name}
          </Text>
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: SPACINGS.tiny,
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <Text size={FONT_SIZES.caption} color={theme.onSurfaceVariant}>
            {item.account_name}
          </Text>
          <Text size={FONT_SIZES.small} color={theme.onSurfaceVariant}>
            •
          </Text>

          <Text size={FONT_SIZES.caption} color={theme.onSurfaceVariant}>
            {time.toLocaleDateString("en-GB", {
              weekday: "short",
              day: "2-digit",
              month: "short",
            })}
          </Text>
          <Text size={FONT_SIZES.small} color={theme.onSurfaceVariant}>
            •
          </Text>
          <Text size={FONT_SIZES.caption} color={theme.onSurfaceVariant}>
            {time.toLocaleTimeString("en-GB", {
              timeStyle: "short",
            })}
          </Text>
        </View>
      </View>
      <View>
        <Text
          size={16}
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
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACINGS.sm,
  },
  title: {
    flexShrink: 1,
    flexWrap: "wrap",
    fontWeight: "bold",
    marginBottom: SPACINGS.tiny,
  },
  amount: {
    fontWeight: "bold",
    textAlign: "right",
  },
});
