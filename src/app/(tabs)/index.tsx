import { TransactionsGroupedByDate } from "@/components/Organisms/TransactionsGroupedByDate";
import Container from "@/components/UI/Container";
import { useTheme } from "@/context/ThemeContext";
import useProfile from "@/queries/useProfile";
import useTransactions from "@/queries/useTransactions";
import { useSQLiteContext } from "expo-sqlite";

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  FlatList,
} from "react-native";

export default function HomeScreen() {
  const { theme } = useTheme();
  const db = useSQLiteContext();
  const { profileData } = useProfile(db);
  const { transactionsGroupedByDate, isLoading: isTransactionsLoading } =
    useTransactions(db);

  if (isTransactionsLoading) {
    return <ActivityIndicator size={"large"} />;
  }

  return (
    <FlatList
      ListHeaderComponent={
        <Container>
          <Text style={[styles.title, { color: theme.onSurface }]}>
            {profileData?.name}
          </Text>
          <Text style={[styles.subtitle, { color: theme.onSurface }]}>
            Welcome Back!
          </Text>
          <View style={styles.container}>
            <TransactionsGroupedByDate
              transactionsGroupedByDate={transactionsGroupedByDate}
            />
          </View>
        </Container>
      }
      data={null}
      renderItem={null}
    />
  );
}

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
