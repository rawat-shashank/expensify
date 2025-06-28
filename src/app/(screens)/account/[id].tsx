import AccountForm from "@/components/Organisms/Forms/AccountForm";
import { Icons } from "@/components/Atoms/Icons";
import Container from "@/components/UI/Container";
import { AccountType } from "@/database/accountsSchema";
import useAccounts from "@/queries/useAccounts";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import alert from "@/components/Alert";
import { useTheme } from "@/context/ThemeContext";

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
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                paddingRight: 16,
              }}
            >
              <Icons name="arrow-back" color={theme.onSurface} />
            </TouchableOpacity>
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

      <Container>
        <AccountForm
          account={currentAccount}
          onUpdateAccount={handleUpdateAccount}
        />
      </Container>
    </>
  );
};

export default EditAccountPage;
