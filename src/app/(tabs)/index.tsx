import { useSQLiteContext } from "expo-sqlite";
import { ActivityIndicator, FlatList, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import { TransactionDetaillsType } from "@/database/transactionSchema";
import { useSummaryCard } from "@/queries/useGeneral";
import useTransactions from "@/queries/transactions";
import {
  Text,
  Container,
  IconListItem,
  SummaryCard,
  TransactionListItem,
  ItemSeparator,
} from "@/components";
import { FONT_SIZES, SPACINGS } from "@/constants/sizes";
import { useUserAccount } from "@/context/UserAccountContext";

const HomeScreen = () => {
  const { theme, userAccountData } = useUserAccount();
  const db = useSQLiteContext();
  const { summaryCard, isLoading: isLoadingSummaryCard } = useSummaryCard(db);

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

  const renderItem = ({ item }: { item: TransactionDetaillsType }) => (
    <IconListItem
      icon={item.category_icon}
      color={item.category_color}
      onPress={() => handleCardPress(item.id)}
    >
      <TransactionListItem item={item} />
    </IconListItem>
  );

  if (isLoadingSummaryCard) {
    return <ActivityIndicator size={"large"} />;
  }

  return (
    <Container>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        onEndReached={() => {
          if (hasNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        onRefresh={() => refetchPaginatedTransactions()}
        refreshing={false}
        ListHeaderComponent={
          <>
            <Text
              size={FONT_SIZES.h4}
              color={theme.onSurface}
              style={{ marginBottom: SPACINGS.xxs }}
            >
              {userAccountData?.name}
            </Text>

            <Text size={FONT_SIZES.small} color={theme.onSurface}>
              Welcome Back!
            </Text>

            <SummaryCard summaryCardDetails={summaryCard} />
            <Text
              color={theme.onSurface}
              size={FONT_SIZES.subheading}
              style={styles.latestTransactionsTitle}
            >
              Latest Transactions
            </Text>
            {transactions.length === 0 && (
              <Text color={theme.onSurface}>No Transactions</Text>
            )}
          </>
        }
        ListFooterComponent={() =>
          hasNextPage ? <ActivityIndicator size="small" /> : null
        }
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  latestTransactionsTitle: {
    fontWeight: "bold",
    marginTop: SPACINGS.sm,
    marginBottom: SPACINGS.xxs,
  },
});

export default HomeScreen;
