import useTransactions from "@/queries/transactions";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { Text, TouchableOpacity, View } from "react-native";
import alert from "@/components/Alert";
import { TransactionType } from "@/database/transactionSchema";
import { Container } from "@/components";
import { Icons } from "@/components/";
import { TransactionForm } from "@/components/Organisms/Forms/TransactionForm";
import { useTheme } from "@/context/ThemeContext";
import { TouchableButton } from "@/components";
import { FlatList } from "react-native-gesture-handler";

const EditTransactionPage = () => {
  const { theme } = useTheme();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const db = useSQLiteContext();

  const transactionId = typeof id === "string" ? parseInt(id, 10) : 0;

  const {
    transactionDetails,
    isPending,
    deleteTransaction,
    updateTransaction,
  } = useTransactions(db, {
    transactionId,
  });

  const handleUpdateTransaction = async (transaction: TransactionType) => {
    await updateTransaction(transaction);
    router.back();
  };

  if (!transactionDetails) {
    return (
      <View>
        <Text>No transaction for this ID </Text>
      </View>
    );
  }

  const handleDeleteTransaction = () => {
    if (transactionId) {
      alert(
        "Delete Transaction",
        `Are you sure you want to delete the transaction "${transactionDetails?.name}"?`,
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
              const success = await deleteTransaction(transactionId);
              if (success) {
                router.back();
              }
            },
          },
        ],
      );
    }
  };

  if (isPending) {
    return <Text>Loading transaction details...</Text>;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Update Transaction",
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
          headerRight: () => (
            <TouchableOpacity onPress={handleDeleteTransaction}>
              <Icons name="delete" color={theme.tertiary} />
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
            <TransactionForm
              transaction={transactionDetails}
              onUpdateTransaction={handleUpdateTransaction}
            />
          </Container>
        }
      />
    </>
  );
};

export default EditTransactionPage;
