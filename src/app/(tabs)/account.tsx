import { useCallback, useRef, useState } from "react";
import { FlatList, ActivityIndicator, View, Alert } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { useRouter } from "expo-router";

import useAccounts from "@/queries/accounts";
import useTransactions from "@/queries/transactions";
import { useTheme } from "@/context/ThemeContext";

import { AccountSummaryType } from "@/database/accountsSchema";
import { TransactionDetaillsType } from "@/database/transactionSchema";

import {
  Container,
  Text,
  AccountCard,
  ColorDotWithRing,
  IconListItem,
  TransactionListItem,
} from "@/components";

const AccountList = () => {
  const { theme } = useTheme();

  const db = useSQLiteContext();
  if (!db) {
    return <Text>Database not ready.</Text>;
  }

  const { accountSummaryList, isLoading, deleteAccount } = useAccounts(db);
  console.log("accountSummaryList", accountSummaryList);

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
      Alert.alert(
        "Delete Account",
        `Are you sure you want to delete the account ?`,
        [
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
        ],
      );
    }
  };

  //FIXME: UI need to be updated later
  const renderAccounts = ({ item }: { item: AccountSummaryType }) => {
    return (
      <AccountCard
        account={item}
        handleCardPress={handleCardPress}
        handleDeleteAccount={handleDeleteAccount}
      />
    );
  };

  if (isLoading) {
    return <ActivityIndicator size={"large"} />;
  }

  const AccountTransactions = ({ accountId }: { accountId: number }) => {
    const router = useRouter();
    const handleCardPress = (transactionId: number) => {
      router.push(`/transaction/${transactionId}`);
    };
    const {
      transactions,
      hasNextPage,
      fetchNextPage,
      refetchPaginatedTransactions,
    } = useTransactions(db, {
      accountId: accountId,
    });

    const renderItem = ({ item }: { item: TransactionDetaillsType }) => (
      <IconListItem
        icon={item.category_icon}
        color={item.category_color}
        onPress={() => handleCardPress(item.id)}
      >
        <TransactionListItem item={item} />
      </IconListItem>
    );

    return (
      <View>
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          onEndReached={() => {
            if (hasNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          onRefresh={() => refetchPaginatedTransactions()}
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
          <View style={{ display: "flex" }}>
            {accountSummaryList && accountSummaryList.length > 0 ? (
              <FlatList
                data={accountSummaryList}
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
              {accountSummaryList.length > 1 &&
                accountSummaryList.map(
                  (account: AccountSummaryType, index: number) => {
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
                  },
                )}
            </View>
            {accountSummaryList.length > 0 && (
              <AccountTransactions
                accountId={accountSummaryList[currentVisibleIndex]?.id}
              />
            )}
          </View>
        </Container>
      }
    />
  );
};

export default AccountList;
