import { Icons } from "@/components/Atoms/Icons";
import { TouchableButton } from "@/components/Atoms/TouchableButtons";
import { TransactionForm } from "@/components/Organisms/Forms/TransactionForm";
import Container from "@/components/UI/Container";
import { useTheme } from "@/context/ThemeContext";
import { AddTransactionType } from "@/database/transactionSchema";
import useTransactions from "@/queries/useTransactions";
import { Stack, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";

const CreateTransaction = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const db = useSQLiteContext();
  const { addTransaction } = useTransactions(db);

  const onAddTransaction = async (newTransaction: AddTransactionType) => {
    addTransaction(newTransaction);
    router.back();
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Add Transaction",

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
        <TransactionForm onAddTransaction={onAddTransaction} />
      </Container>
    </>
  );
};
export default CreateTransaction;
