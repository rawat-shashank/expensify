import { SummaryCard } from "@/components/Molecules/SummaryCard";
import { TransactionListItem } from "@/components/Molecules/TransactionListItem";
import { Container } from "@/components";
import { useTheme } from "@/context/ThemeContext";
import { TransactionDetaillsType } from "@/database/transactionSchema";
import { useSummaryCard } from "@/queries/useGeneral"; // Assuming this still exists and is needed
import useProfile from "@/queries/useProfile"; // Assuming this still exists and is needed
import useTransactions from "@/queries/transactions"; // Your combined transactions hook
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";

import { ActivityIndicator, Text, FlatList } from "react-native";
import { StyleSheet } from "react-native"; // Keep StyleSheet if 'styles.title' and 'styles.subtitle' are used

export default function HomeScreen() {
  const { theme } = useTheme();
  const db = useSQLiteContext();
  const { profileData } = useProfile(db);
  const { summaryCard, isLoading: isLoadingSummaryCard } = useSummaryCard(db);

  // Using the combined useTransactions hook.
  // The 'transactions' here will be the paginated ones by default as per your last setup.
  const {
    transactions,
    hasNextPage,
    fetchNextPage,
    refetchPaginatedTransactions,
  } = useTransactions(db);

  const router = useRouter();

  const handleCardPress = (transactionId: number) => {
    router.push(`/transaction/${transactionId}`);
  };

  // Render function for individual transaction items in the main FlatList
  const renderTransactionItem = ({
    item,
  }: {
    item: TransactionDetaillsType;
  }) => <TransactionListItem item={item} onPress={handleCardPress} />;

  // Show loading indicator for critical initial data (summary card)
  if (isLoadingSummaryCard) {
    return <ActivityIndicator size={"large"} />;
  }

  return (
    <Container>
      <FlatList
        // The main FlatList now directly consumes the paginated transactions
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTransactionItem}
        onEndReached={() => {
          if (hasNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        onRefresh={() => refetchPaginatedTransactions()} // Pull-to-refresh
        refreshing={false} // You might want to tie this to a specific refreshing state from your useTransactions hook
        ListHeaderComponent={
          <>
            <Text style={[styles.title, { color: theme.onSurface }]}>
              {profileData?.name}
            </Text>
            <Text style={[styles.subtitle, { color: theme.onSurface }]}>
              Welcome Back!
            </Text>
            <SummaryCard summaryCardDetails={summaryCard} />
            {/* If you want a section title for "Latest Transactions" */}
            <Text
              style={[
                styles.latestTransactionsTitle,
                { color: theme.onSurface },
              ]}
            >
              Latest Transactions
            </Text>
          </>
        }
        // Optional: A footer component for loading more data
        ListFooterComponent={() =>
          // You might have a specific loading state from useTransactions (e.g., isFetchingNextPage)
          // For simplicity, just showing an indicator if there's more data to load.
          hasNextPage ? <ActivityIndicator size="small" /> : null
        }
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  // Kept only the styles that are actually used in this component
  subtitle: {
    fontSize: 13,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  latestTransactionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20, // Add some space above the title
    marginBottom: 10,
  },
});
