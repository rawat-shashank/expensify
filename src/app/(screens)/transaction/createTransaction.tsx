import { TransactionForm } from "@/components/Organisms/Forms/TransactionForm";
import Container from "@/components/UI/Container";
import { AddTransactionType } from "@/database/transactionSchema";
import useTransactions from "@/queries/useTransactions";
import { Stack, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";

const CreateTransaction = () => {
  const router = useRouter();
  const db = useSQLiteContext();
  const { addTransaction } = useTransactions(db);

  const onAddTransaction = async (newTransaction: AddTransactionType) => {
    addTransaction(newTransaction);
    router.back();
  };

  return (
    <>
      <Stack.Screen options={{ title: "Add Transaction" }} />
      <Container>
        <TransactionForm onAddTransaction={onAddTransaction} />
      </Container>
    </>
  );
};
export default CreateTransaction;
