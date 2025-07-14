import { useEffect, useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Text, TouchableOpacity, FlatList } from "react-native";
import { useSQLiteContext } from "expo-sqlite";

import alert from "@/components/Alert";
import useAccounts from "@/queries/useAccounts";
import { AccountType } from "@/database/accountsSchema";
import { useTheme } from "@/context/ThemeContext";
import { TouchableButton, Container, Icons, AccountForm } from "@/components";

const EditAccountPage = ({}: {}) => {
  const { theme } = useTheme();
  const router = useRouter();
  const db = useSQLiteContext();
  const { getAccountById, updateAccount, deleteAccount } = useAccounts(db);

  const { id } = useLocalSearchParams();
  const accountId = typeof id === "string" ? parseInt(id, 10) : undefined;

  const [loadingAccount, setLoadingAccount] = useState(true);
  const [currentAccount, setCurrentAccount] = useState<AccountType | undefined>(
    undefined,
  );

  useEffect(() => {
    const loadAccount = async () => {
      if (accountId) {
        setLoadingAccount(true);
        const account = await getAccountById(accountId);
        if (account) {
          setCurrentAccount(account);
        }
      }
      setLoadingAccount(false);
    };
    loadAccount();
  }, [accountId, getAccountById]);

  const handleUpdateAccount = async (account: AccountType) => {
    await updateAccount(account);
    router.back();
  };

  const handleDeleteAccount = async () => {
    if (currentAccount?.id) {
      alert(
        "Delete Account",
        `Are you sure you want to delete the account "${currentAccount.name}"?`,
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
              setLoadingAccount(true);
              const success = await deleteAccount(currentAccount.id);
              setLoadingAccount(false);
              if (success) {
                router.back();
              }
            },
          },
        ],
      );
    }
  };

  if (loadingAccount) {
    return <Text>Loading category details...</Text>;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Update Account",
          headerTitleStyle: {
            color: theme.onSurface,
          },
          headerLeft: () => (
            <TouchableButton
              onPress={() => router.back()}
              style={{
                paddingRight: 16,
              }}
            >
              <Icons name="arrow-back" color={theme.onSurface} />
            </TouchableButton>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handleDeleteAccount}>
              <Icons name="delete" color={theme.onSurface} />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: theme.background,
          },
        }}
      />

      <FlatList
        renderItem={null}
        data={null}
        ListHeaderComponent={
          <Container>
            <AccountForm
              account={currentAccount}
              onUpdateAccount={handleUpdateAccount}
            />
          </Container>
        }
      />
    </>
  );
};

export default EditAccountPage;
