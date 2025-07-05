import { Text, FlatList, ActivityIndicator, View } from "react-native";
import useAccounts from "@/queries/useAccounts";
import { useSQLiteContext } from "expo-sqlite";
import { useRouter } from "expo-router";
import { AccountSummaryType } from "@/database/accountsSchema";
import AccountCard from "@/components/AccountCard";
import alert from "@/components/Alert";
import useTransactions from "@/queries/useTransactions";
import Container from "@/components/UI/Container";
import { useCallback, useRef, useState } from "react";
import { ColorDotWithRing } from "@/components/UI/ColorDotWithRing";
import { useTheme } from "@/context/ThemeContext";
import { TransactionsGroupedByDate } from "@/components/Organisms/TransactionsGroupedByDate";

const AccountList = () => {
  const { theme } = useTheme();

  const db = useSQLiteContext();
  if (!db) {
    return <Text>Database not ready.</Text>;
  }

  const {
    accounts,
    accountsSummary,
    isLoading: isAccountLoading,
    deleteAccount,
  } = useAccounts(db);

  const router = useRouter();

  const [currentVisibleIndex, setCurrentVisibleIndex] = useState(0);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 70,
    minimumViewTime: 200,
    waitForInteraction: false,
  }).current;

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: any }) => {
      if (viewableItems.length > 0) {
        const firstMostlyVisibleItem = viewableItems[0];

        if (firstMostlyVisibleItem.index !== currentVisibleIndex) {
          setCurrentVisibleIndex(firstMostlyVisibleItem.index);
        }
      }
    },
    [currentVisibleIndex],
  );

  const handleCardPress = (accountId: number) => {
    router.push(`/account/${accountId}`);
  };

  const handleDeleteAccount = (accountId: number) => {
    if (accountId) {
      alert("Delete Account", `Are you sure you want to delete the account ?`, [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => {},
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteAccount(accountId);
          },
        },
      ]);
    }
  };

  //FIXME: UI need to be updated later
  const renderAccounts = ({ item }: { item: AccountSummaryType }) => (
    <AccountCard
      account={item}
      handleCardPress={handleCardPress}
      handleDeleteAccount={handleDeleteAccount}
    />
  );

  if (isAccountLoading) {
    return <ActivityIndicator size={"large"} />;
  }

  const AccountTransactions = ({ accountId }: { accountId: number }) => {
    const { transactionsGroupedByDate } = useTransactions(db, {
      accountId: accountId,
    });

    return (
      <View>
        <TransactionsGroupedByDate
          transactionsGroupedByDate={transactionsGroupedByDate}
        />
      </View>
    );
  };

  return (
    <FlatList
      renderItem={null}
      data={null}
      ListHeaderComponent={
        <Container>
          <View>
            {accountsSummary && accountsSummary.length > 0 ? (
              <FlatList
                data={accountsSummary}
                renderItem={renderAccounts}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
              />
            ) : (
              <Text style={{ color: theme.onSurface }}>
                No accounts created yet.
              </Text>
            )}
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 4,
                marginVertical: 4,
              }}
            >
              {accounts.length > 1 &&
                accounts.map((account, index) => {
                  return currentVisibleIndex == index ? (
                    <ColorDotWithRing
                      key={account.id}
                      size={16}
                      color={theme.onSurfaceVariant}
                    />
                  ) : (
                    <ColorDotWithRing
                      key={account.id}
                      outline={true}
                      size={16}
                      color={theme.onSurfaceVariant}
                    />
                  );
                })}
            </View>
            <AccountTransactions accountId={accounts[currentVisibleIndex].id} />
          </View>
        </Container>
      }
    />
  );
};

export default AccountList;
