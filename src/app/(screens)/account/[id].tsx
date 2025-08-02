import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Text, TouchableOpacity, FlatList, Alert } from "react-native";
import { useSQLiteContext } from "expo-sqlite";

import useAccounts from "@/queries/accounts";
import { AccountType } from "@/database/accountsSchema";
import { useTheme } from "@/context/ThemeContext";
import { TouchableButton, Container, Icons, AccountForm } from "@/components";
import { SPACINGS } from "@/constants/sizes";

const EditAccountPage = ({}: {}) => {
  const { theme } = useTheme();
  const router = useRouter();
  const db = useSQLiteContext();

  const { id } = useLocalSearchParams();
  const accountId = typeof id === "string" ? parseInt(id, 10) : 0;
  const { accountDetails, isLoading, updateAccount, deleteAccount } =
    useAccounts(db, {
      accountId,
    });

  const handleUpdateAccount = async (account: AccountType) => {
    await updateAccount(account);
    router.back();
  };

  const handleDeleteAccount = async () => {
    if (accountDetails?.id) {
      Alert.alert(
        "Delete Account",
        `Are you sure you want to delete the account "${accountDetails.name}"?`,
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
              const success = await deleteAccount(accountDetails.id);
              if (success) {
                router.push(`/account`);
              }
            },
          },
        ],
      );
    }
  };

  if (isLoading) {
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
                paddingRight: SPACINGS.md,
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
              account={accountDetails}
              onUpdateAccount={handleUpdateAccount}
            />
          </Container>
        }
      />
    </>
  );
};

export default EditAccountPage;
