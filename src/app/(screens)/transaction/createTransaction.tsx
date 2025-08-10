import { FlatList } from "react-native";
import { Stack, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";

import { CreateTransactionType } from "@/database/transactionSchema";
import useTransactions from "@/queries/transactions";
import {
  Icons,
  TransactionForm,
  TouchableButton,
  Container,
} from "@/components";
import { SPACINGS } from "@/constants/sizes";
import { useUserAccount } from "@/context/UserAccountContext";

const CreateTransaction = () => {
  const { theme } = useUserAccount();
  const router = useRouter();
  const db = useSQLiteContext();
  const { addTransaction } = useTransactions(db);

  const onAddTransaction = async (newTransaction: CreateTransactionType) => {
    addTransaction(newTransaction);
    router.back();
  };

  return (
    <Container>
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
        ListHeaderComponent={
          <TransactionForm onAddTransaction={onAddTransaction} />
        }
      />
    </Container>
  );
};
export default CreateTransaction;
