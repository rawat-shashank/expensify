import useTransactions from "@/hooks/useTransactions"; // Create this hook
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import alert from "@/components/Alert";
import { TransactionType } from "@/database/transactionSchema";

const EditTransactionForm = () => {
  const db = useSQLiteContext();
  const { getTransactionById, deleteTransaction, updateTransaction } =
    useTransactions(db); // Implement these functions in your hook
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const transactionId = typeof id === "string" ? parseInt(id, 10) : undefined;
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDesc] = useState("");
  const [transaction_date, setTransactionDate] = useState("");
  const [account_id, setAccountId] = useState("");
  const [category_id, setCategoryId] = useState("");
  const [type, setType] = useState<"expense" | "income" | "transfer">(
    "expense",
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentTransaction, setCurrentTransaction] = useState<
    TransactionType | undefined
  >(undefined);

  useEffect(() => {
    const loadTransaction = async () => {
      if (transactionId) {
        setLoading(true);
        const transaction = await getTransactionById(transactionId);
        console.log(transaction);

        if (transaction) {
          setCurrentTransaction(transaction);
          setTitle(transaction.title);
          setAmount(transaction.amount.toString());
          setDesc(transaction.description || "");
          setTransactionDate(transaction.transaction_date);
          setAccountId(transaction.account_id.toString());
          setCategoryId(transaction.category_id.toString());
          setType(transaction.type);
        } else {
          setError("Transaction not found.");
        }
        setLoading(false);
      } else {
        setError("Invalid transaction ID.");
        setLoading(false);
      }
    };

    loadTransaction();
  }, [transactionId, getTransactionById]);

  const handleUpdateTransaction = async () => {
    if (
      !title.trim() ||
      !amount.trim() ||
      !transaction_date.trim() ||
      !category_id.trim() ||
      !type
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    console.log("update", transaction_date);
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      setError("Amount must be a valid number.");
      return;
    }

    const parsedCategoryId = parseInt(category_id, 10);
    if (isNaN(parsedCategoryId)) {
      setError("Category ID must be a valid number.");
      return;
    }

    //const timestamp = new Date(date).getTime();
    //if (isNaN(timestamp)) {
    //  setError("Date must be a valid date.");
    //  return;
    //}

    const parsedAccountId = account_id ? parseInt(account_id, 10) : -1;
    if (account_id && isNaN(parsedAccountId)) {
      setError("Account ID must be a valid number.");
      return;
    }

    if (currentTransaction?.id) {
      const updatedTransaction: TransactionType = {
        id: currentTransaction.id,
        title,
        amount: parsedAmount,
        description,
        transaction_date: transaction_date,
        account_id: parsedAccountId,
        category_id: parsedCategoryId,
        type,
      };

      await updateTransaction(updatedTransaction);
      router.back();
    } else {
      setError("Could not update transaction: ID is missing.");
    }
  };

  const handleDeleteTransaction = () => {
    if (currentTransaction?.id) {
      alert(
        "Delete Transaction",
        `Are you sure you want to delete the transaction "${currentTransaction.title}"?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              setLoading(true);
              const success = await deleteTransaction(currentTransaction.id);
              setLoading(false);
              if (success) {
                router.back();
              } else {
                setError("Failed to delete transaction.");
              }
            },
          },
        ],
      );
    }
  };

  if (loading) {
    return <Text>Loading transaction details...</Text>;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Edit Transaction</Text>
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
        <Text style={styles.label}>Description:</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDesc}
          placeholder="Optional description"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Date:</Text>
        <TextInput
          style={styles.input}
          value={transaction_date}
          onChangeText={setTransactionDate}
          placeholder="YYYY-MM-DD"
        />
      </View>

      {/* Conditionally render accountId if it exists in your schema */}
      {currentTransaction?.account_id !== undefined && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Account ID:</Text>
          <TextInput
            style={styles.input}
            value={account_id}
            onChangeText={setAccountId}
            placeholder="Enter Account ID"
            keyboardType="numeric"
          />
          {/* Consider using a dropdown/picker */}
        </View>
      )}

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Category ID:</Text>
        <TextInput
          style={styles.input}
          value={category_id}
          onChangeText={setCategoryId}
          placeholder="Enter Category ID"
          keyboardType="numeric"
        />
        {/* Consider using a dropdown/picker */}
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
        onPress={handleUpdateTransaction}
      >
        <Text style={styles.createButtonText}>Update Transaction</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDeleteTransaction}
      >
        <Text style={styles.deleteButtonText}>Delete Transaction</Text>
      </TouchableOpacity>
    </View>
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
  deleteButton: {
    backgroundColor: "#dc3545",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default EditTransactionForm;
