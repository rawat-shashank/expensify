import useAccounts from "@/hooks/useAccounts";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Switch,
} from "react-native";

interface Account {
  id: number;
  title: string;
  accountName: string;
  amount: number;
  defaultAccount: boolean;
  type: "cash" | "wallet" | "bank";
}

const CreateAccount = ({}: {}) => {
  const db = useSQLiteContext();
  const { addAccount } = useAccounts(db);

  return <CreateAccountForm addAccount={addAccount} />;
};

const CreateAccountForm = ({
  addAccount,
}: {
  addAccount: (
    title: string,
    accountName: string,
    amount: number,
    defaultAccount: boolean,
    type: "cash" | "wallet" | "bank",
  ) => Promise<number | undefined>;
}) => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [accountName, setAccountName] = useState("");
  const [amount, setAmount] = useState("");
  const [defaultAccount, setDefaultAccount] = useState(false);
  const [type, setType] = useState<"cash" | "wallet" | "bank">("cash");
  const [error, setError] = useState("");

  const handleCreateAccount = async () => {
    if (!title.trim() || !accountName.trim() || !amount.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      setError("Amount must be a valid number.");
      return;
    }

    const newAccount: Omit<Account, "id"> = {
      title,
      accountName,
      amount: parsedAmount,
      defaultAccount,
      type,
    };

    await addAccount(
      newAccount.title,
      newAccount.accountName,
      newAccount.amount,
      newAccount.defaultAccount,
      newAccount.type,
    );
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create New Account</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Title:</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="e.g., Savings, Main Wallet"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Account Name:</Text>
        <TextInput
          style={styles.input}
          value={accountName}
          onChangeText={setAccountName}
          placeholder="e.g., My Bank Account, Personal Wallet"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Amount:</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          placeholder="e.g., 100.50"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Default Account:</Text>
        <Switch value={defaultAccount} onValueChange={setDefaultAccount} />
      </View>

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Type:</Text>
        <View style={styles.typeButtons}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === "cash" && styles.activeTypeButton,
            ]}
            onPress={() => setType("cash")}
          >
            <Text
              style={[
                styles.typeButtonText,
                type === "cash" && styles.activeTypeButtonText,
              ]}
            >
              Cash
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === "wallet" && styles.activeTypeButton,
            ]}
            onPress={() => setType("wallet")}
          >
            <Text
              style={[
                styles.typeButtonText,
                type === "wallet" && styles.activeTypeButtonText,
              ]}
            >
              Wallet
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === "bank" && styles.activeTypeButton,
            ]}
            onPress={() => setType("bank")}
          >
            <Text
              style={[
                styles.typeButtonText,
                type === "bank" && styles.activeTypeButtonText,
              ]}
            >
              Bank
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.createButton}
        onPress={handleCreateAccount}
      >
        <Text style={styles.createButtonText}>Create Account</Text>
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
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
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

export default CreateAccount;
