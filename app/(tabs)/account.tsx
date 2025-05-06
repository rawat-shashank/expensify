import useAccounts from "@/hooks/useAccounts";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

export default function Account() {
  const db = useSQLiteContext();
  const { accounts, addAccount, loading, error, fetchAccounts } =
    useAccounts(db);
  const [newAccountTitle, setNewAccountTitle] = useState("");
  const [newAccountName, setNewAccountName] = useState("");
  const [newAccountAmount, setNewAccountAmount] = useState("");
  const [newAccountType] = useState<"cash" | "wallet" | "bank">("cash");
  const [isDefault, setIsDefault] = useState(false);

  const handleAddAccount = async () => {
    if (
      newAccountTitle &&
      newAccountName &&
      newAccountAmount &&
      newAccountType
    ) {
      const amount = parseFloat(newAccountAmount);
      if (!isNaN(amount)) {
        const newId = await addAccount(
          newAccountTitle,
          newAccountName,
          amount,
          isDefault,
          newAccountType,
        );
        if (newId) {
          console.log("Account added with ID:", newId);
          // Optionally clear the form
          setNewAccountTitle("");
          setNewAccountName("");
          setNewAccountAmount("");
          setIsDefault(false);
        }
      } else {
        console.warn("Invalid amount entered.");
      }
    } else {
      console.warn("Please fill in all account details.");
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <View>
      <Text>Accounts:</Text>
      {accounts.map((account) => (
        <Text key={account.id}>
          {account.title} - {account.accountName}: £{account.amount.toFixed(2)}{" "}
          ({account.type}) {account.defaultAccount ? "(Default)" : ""}
        </Text>
      ))}

      <Text>Add New Account:</Text>
      <TouchableOpacity title="Add Account" onPress={handleAddAccount} />

      <TouchableOpacity title="Refresh Accounts" onPress={fetchAccounts} />
    </View>
  );
}
