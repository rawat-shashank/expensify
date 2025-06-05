import Header from "@/components/Header";
import Container from "@/components/UI/Container";
import { AddAccountType } from "@/database/accountsSchema";
import useAccounts from "@/queries/useAccounts";
import { Stack, useRouter } from "expo-router";
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

const CreateAccount = ({}: {}) => {
  const db = useSQLiteContext();
  const { addAccount } = useAccounts(db);

  return <CreateAccountForm addAccount={addAccount} />;
};

const CreateAccountForm = ({
  addAccount,
}: {
  addAccount: (newAccount: AddAccountType) => Promise<number | undefined>;
}) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [amount, setAmount] = useState("");
  const [defaultAccount, setDefaultAccount] = useState(false);
  const [cardType, setCardType] = useState<"cash" | "wallet" | "bank">("cash");
  const [error, setError] = useState("");

  const handleCreateAccount = async () => {
    if (!name.trim() || !accountName.trim() || !amount.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      setError("Amount must be a valid number.");
      return;
    }

    const newAccount: AddAccountType = {
      name,
      accountName,
      amount: parsedAmount,
      cardType,
    };

    await addAccount(newAccount);
    router.back();
  };

  return (
    <>
      <Stack.Screen options={{ title: "Add Account" }} />
      <Container>
        <Text style={styles.heading}>Create New Account</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Title:</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
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
                cardType === "cash" && styles.activeTypeButton,
              ]}
              onPress={() => setCardType("cash")}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  cardType === "cash" && styles.activeTypeButtonText,
                ]}
              >
                Cash
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                cardType === "wallet" && styles.activeTypeButton,
              ]}
              onPress={() => setCardType("wallet")}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  cardType === "wallet" && styles.activeTypeButtonText,
                ]}
              >
                Wallet
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                cardType === "bank" && styles.activeTypeButton,
              ]}
              onPress={() => setCardType("bank")}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  cardType === "bank" && styles.activeTypeButtonText,
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
      </Container>
    </>
  );
};

const styles = StyleSheet.create({
  container: {},
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
