import Container from "@/components/UI/Container";
import { AddTransactionType } from "@/database/transactionSchema";
import useTransactions from "@/queries/useTransactions"; // Create this hook
import { Stack, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";

interface CreateTransactionProps {}

const CreateTransaction = ({}: CreateTransactionProps) => {
  const db = useSQLiteContext();
  const { addTransaction } = useTransactions(db);

  return <CreateTransactionForm addTransaction={addTransaction} />;
};

interface CreateTransactionFormProps {
  addTransaction: (
    newTransaction: AddTransactionType,
  ) => Promise<number | undefined>;
}

const CreateTransactionForm = ({
  addTransaction,
}: CreateTransactionFormProps) => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setdescription] = useState("");
  const [transaction_date, setTransactionDate] = useState("");
  const [account_id, setAccountId] = useState("");
  const [category_id, setCategoryId] = useState("");
  const [type, setType] = useState<"expense" | "income" | "transfer">(
    "expense",
  );
  const [error, setError] = useState("");

  const handleCreateTransaction = async () => {
    if (
      !title.trim() ||
      !amount.trim() ||
      !transaction_date.trim() ||
      !account_id.trim() ||
      !category_id.trim() ||
      !type
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    console.log("create", transaction_date);
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      setError("Amount must be a valid number.");
      return;
    }

    const parsedAccountId = parseInt(account_id, 10);
    if (isNaN(parsedAccountId)) {
      setError("Account ID must be a valid number.");
      return;
    }

    const parsedCategoryId = parseInt(category_id, 10);
    if (isNaN(parsedCategoryId)) {
      setError("Category ID must be a valid number.");
      return;
    }

    // Consider converting the date string to a Unix timestamp (number)
    //const timestamp = new Date(date).getTime();
    //if (isNaN(timestamp)) {
    //  setError("Date must be a valid date.");
    //  return;
    //}

    const newTransaction: AddTransactionType = {
      title,
      amount: parsedAmount,
      description,
      transaction_date,
      account_id: parsedAccountId,
      category_id: parsedCategoryId,
      type,
    };
    await addTransaction(newTransaction);
    router.back();
  };

  return (
    <>
      <Stack.Screen options={{ title: "Add Transaction" }} />
      <Container>
        <ScrollView style={styles.container}>
          <Text style={styles.heading}>Create New Transaction</Text>
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Title:</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g., Groceries, Salary"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Amount:</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              placeholder="e.g., 25.50"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>descriptionription:</Text>
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setdescription}
              placeholder="Optional descriptionription"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Date:</Text>
            <TextInput
              style={styles.input}
              value={transaction_date}
              onChangeText={setTransactionDate}
              placeholder="YYYY-MM-DD or other valid format"
            />
            {/* Consider using a DatePicker component for a better user experience */}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Account ID:</Text>
            <TextInput
              style={styles.input}
              value={account_id}
              onChangeText={setAccountId}
              placeholder="Enter Account ID"
              keyboardType="numeric"
            />
            {/* Consider using a dropdown/picker to select from existing accounts */}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Category ID:</Text>
            <TextInput
              style={styles.input}
              value={category_id}
              onChangeText={setCategoryId}
              placeholder="Enter Category ID"
              keyboardType="numeric"
            />
            {/* Consider using a dropdown/picker to select from existing categories */}
          </View>

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Type:</Text>
            <View style={styles.typeButtons}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === "expense" && styles.activeTypeButton,
                ]}
                onPress={() => setType("expense")}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    type === "expense" && styles.activeTypeButtonText,
                  ]}
                >
                  Expense
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === "income" && styles.activeTypeButton,
                ]}
                onPress={() => setType("income")}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    type === "income" && styles.activeTypeButtonText,
                  ]}
                >
                  Income
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === "transfer" && styles.activeTypeButton,
                ]}
                onPress={() => setType("transfer")}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    type === "transfer" && styles.activeTypeButtonText,
                  ]}
                >
                  Transfer
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateTransaction}
          >
            <Text style={styles.createButtonText}>Create Transaction</Text>
          </TouchableOpacity>
        </ScrollView>
      </Container>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  pickerContainer: {
    marginBottom: 15,
  },
  typeButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 5,
  },
  typeButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  activeTypeButton: {
    backgroundColor: "#007bff",
  },
  typeButtonText: {
    fontSize: 16,
    color: "#333",
  },
  activeTypeButtonText: {
    color: "#fff",
  },
  createButton: {
    backgroundColor: "#28a745",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  createButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CreateTransaction;
