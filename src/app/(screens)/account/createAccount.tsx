import { Stack, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";

import { CreateAccountType } from "@/database/accountsSchema";
import useAccounts from "@/queries/accounts";
import { Container, TouchableButton, Icons, AccountForm } from "@/components";
import { FlatList } from "react-native";
import { SPACINGS } from "@/constants/sizes";
import { useUserAccount } from "@/context/UserAccountContext";

const CreateAccount = () => {
  const { theme } = useUserAccount();
  const db = useSQLiteContext();
  const router = useRouter();

  const { addAccount } = useAccounts(db);

  const handleAddAccount = async (newAccount: CreateAccountType) => {
    await addAccount(newAccount);
    router.back();
  };

  return (
    <Container paddingVertical={SPACINGS.md}>
      <Stack.Screen
        options={{
          title: "Add Account",
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
          headerStyle: {
            backgroundColor: theme.background,
          },
        }}
      />

      <FlatList
        renderItem={null}
        data={null}
        ListHeaderComponent={<AccountForm onAddAccount={handleAddAccount} />}
      />
    </Container>
  );
};

export default CreateAccount;
