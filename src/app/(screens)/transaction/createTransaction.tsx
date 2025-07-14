import { Stack, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";

import { useTheme } from "@/context/ThemeContext";
import { CreateTransactionType } from "@/database/transactionSchema";
import useTransactions from "@/queries/transactions";
import {
  Icons,
  TransactionForm,
  TouchableButton,
  Container,
} from "@/components";
import { FlatList } from "react-native";

const CreateTransaction = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const db = useSQLiteContext();
  const { addTransaction } = useTransactions(db);

  const onAddTransaction = async (newTransaction: CreateTransactionType) => {
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

      <FlatList
        renderItem={null}
        data={null}
        ListHeaderComponent={
          <Container>
            <TransactionForm onAddTransaction={onAddTransaction} />
          </Container>
        }
      />
    </>
  );
};
export default CreateTransaction;
