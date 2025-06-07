import AccountForm from "@/components/Forms/AccountForm";
import { Icons } from "@/components/Icons";
import Container from "@/components/UI/Container";
import { AddAccountType } from "@/database/accountsSchema";
import useAccounts from "@/queries/useAccounts";
import { Stack, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";

const CreateAccount = ({}: {}) => {
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
        }}
      />
      <Container>
        <AccountForm onAddAccount={handleAddAccount} />
      </Container>
    </>
  );
};

export default CreateAccount;
