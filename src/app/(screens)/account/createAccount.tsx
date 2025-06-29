import { Icons } from "@/components/Atoms/Icons";
import { TouchableButton } from "@/components/Atoms/TouchableButtons";
import AccountForm from "@/components/Organisms/Forms/AccountForm";
import Container from "@/components/UI/Container";
import { useTheme } from "@/context/ThemeContext";
import { AddAccountType } from "@/database/accountsSchema";
import useAccounts from "@/queries/useAccounts";
import { Stack, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";

const CreateAccount = () => {
  const { theme } = useTheme();
  const db = useSQLiteContext();
  const router = useRouter();

  const { addAccount } = useAccounts(db);

  const handleAddAccount = async (newAccount: AddAccountType) => {
    await addAccount(newAccount);
    router.back();
  };

  return (
    <>
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
                paddingRight: 16,
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
      <Container>
        <AccountForm onAddAccount={handleAddAccount} />
      </Container>
    </>
  );
};

export default CreateAccount;
