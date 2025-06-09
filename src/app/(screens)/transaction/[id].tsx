import useTransactions from "@/queries/useTransactions";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useState, useEffect } from "react";
import { Text, TouchableOpacity } from "react-native";
import alert from "@/components/Alert";
import { TransactionType } from "@/database/transactionSchema";
import Container from "@/components/UI/Container";
import { materialTheme } from "@/constants";
import { Icons } from "@/components/Atoms/Icons";
import { TransactionForm } from "@/components/Organisms/Forms/TransactionForm";

const EditTransactionPage = () => {
  const router = useRouter();
  const db = useSQLiteContext();
  const { getTransactionById, deleteTransaction, updateTransaction } =
    useTransactions(db);

  const { id } = useLocalSearchParams();
  const transactionId = typeof id === "string" ? parseInt(id, 10) : undefined;

  const [loadingTransaction, setLoadingTransaction] = useState(true);
  const [currentTransaction, setCurrentTransaction] = useState<
    TransactionType | undefined
  >(undefined);

  useEffect(() => {
    const loadTransaction = async () => {
      if (transactionId) {
        setLoadingTransaction(true);
        const transaction = await getTransactionById(transactionId);

        if (transaction) {
          setCurrentTransaction(transaction);
        }
        setLoadingTransaction(false);
      }
    };

    loadTransaction();
  }, [transactionId, getTransactionById]);

  const handleUpdateTransaction = async (transaction: TransactionType) => {
    await updateTransaction(transaction);
    router.back();
  };

  const handleDeleteTransaction = () => {
    if (currentTransaction?.id) {
      alert(
        "Delete Transaction",
        `Are you sure you want to delete the transaction "${currentTransaction.title}"?`,
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
              setLoadingTransaction(true);
              const success = await deleteTransaction(currentTransaction.id);
              setLoadingTransaction(false);
              if (success) {
                router.back();
              }
            },
          },
        ],
      );
    }
  };

  if (loadingTransaction) {
    return <Text>Loading transaction details...</Text>;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Update Transaction",
          headerRight: () => (
            <TouchableOpacity onPress={handleDeleteTransaction}>
              <Icons name="delete" color={materialTheme.tertiary} />
            </TouchableOpacity>
          ),
        }}
      />
      <Container>
        <TransactionForm
          transaction={currentTransaction}
          onUpdateTransaction={handleUpdateTransaction}
        />
      </Container>
    </>
  );
};

export default EditTransactionPage;
