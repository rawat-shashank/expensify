import useAccounts from "@/hooks/useAccounts";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Switch,
} from "react-native";
import alert from "@/components/Alert";
import { AccountType } from "@/database/accountsSchema";

const EditAccountForm = () => {
  const db = useSQLiteContext();
  const { getAccountById, deleteAccount, updateAccount } = useAccounts(db);
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const accountId = typeof id === "string" ? parseInt(id, 10) : undefined;
  const [title, setTitle] = useState("");
  const [accountName, setAccountName] = useState("");
  const [amount, setAmount] = useState("");
  const [defaultAccount, setDefaultAccount] = useState(false);
  const [type, setType] = useState<"cash" | "wallet" | "bank">("cash");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentAccount, setCurrentAccount] = useState<AccountType | undefined>(
    undefined,
  );

  useEffect(() => {
    const loadAccount = async () => {
      if (accountId) {
        setLoading(true);
        const account = await getAccountById(accountId);

        if (account) {
          setCurrentAccount(account);
          setTitle(account.title);
          setAccountName(account.accountName);
          setAmount(account.amount.toString());
          setDefaultAccount(account.defaultAccount);
          setType(account.type);
        } else {
          setError("Account not found.");
        }
        setLoading(false);
      } else {
        setError("Invalid account ID.");
        setLoading(false);
      }
    };

    loadAccount();
  }, [accountId, getAccountById]);

  const handleUpdateAccount = async () => {
    if (!title.trim() || !accountName.trim() || !amount.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      setError("Amount must be a valid number.");
      return;
    }

    if (currentAccount?.id) {
      const updatedAccount: AccountType = {
        id: currentAccount.id,
        title,
        accountName,
        amount: parsedAmount,
        defaultAccount,
        type,
      };

      await updateAccount(updatedAccount);
      router.back();
    } else {
      setError("Could not update account: ID is missing.");
    }
  };

  const handleDeleteAccount = () => {
    if (currentAccount?.id) {
      alert(
        "Delete Account",
        `Are you sure you want to delete the account "${currentAccount.title}"?`,
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
              setLoading(true);
              const success = await deleteAccount(currentAccount.id);
              setLoading(false);
              if (success) {
                router.back();
              } else {
                setError("Failed to delete account.");
              }
            },
          },
        ],
      );
    }
  };

  if (loading) {
    return <Text>Loading account details...</Text>;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Edit Account</Text>
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
        onPress={handleUpdateAccount}
      >
        <Text style={styles.createButtonText}>Update Account</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDeleteAccount}
      >
        <Text style={styles.deleteButtonText}>Delete Account</Text>
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
  deleteButton: {
    backgroundColor: "#dc3545",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default EditAccountForm;
