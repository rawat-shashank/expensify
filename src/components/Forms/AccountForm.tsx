import { materialTheme } from "@/constants";
import {
  AccountCardType,
  AccountType,
  AddAccountType,
} from "@/database/accountsSchema";
import { useState } from "react";
import {
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { PillSelector } from "../UI/PillSelector";
import { Picker } from "../Molecules/Picker";

const AccountForm = ({
  account,
  onAddAccount,
  onUpdateAccount,
}: {
  account?: AccountType;
  onAddAccount?: (newAccount: AddAccountType) => Promise<void>;
  onUpdateAccount?: (newAccount: AccountType) => Promise<void>;
}) => {
  const accountCardOptions: AccountCardType[] = [
    AccountCardType.CASH,
    AccountCardType.WALLET,
    AccountCardType.BANK,
  ];

  const [name, setName] = useState(account?.name || "");
  const [accountName, setAccountName] = useState(account?.accountName || "");
  const [amount, setAmount] = useState(account?.amount.toString() || "");
  const [isDisable, setIsDisable] = useState<boolean>(false);
  const [cardType, setCardType] = useState<AccountCardType>(
    AccountCardType.CASH,
  );
  const [color, setColor] = useState(account?.color || "");

  const [errors, setErrors] = useState<{
    name?: string;
    accountName?: string;
    amount?: string;
  }>({});

  const handleCreateAccount = async () => {
    const newErrors: {
      name?: string;
      accountName?: string;
      amount?: string;
    } = {};
    if (!name.trim()) {
      newErrors.name = "Account holder name required";
    }
    if (!accountName.trim()) {
      newErrors.accountName = "Account name required";
    }

    if (typeof amount === "string" && !amount.trim()) {
      newErrors.amount = "Amount is required.";
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      newErrors.amount = "Amount must be a valid number.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const newAccount: AddAccountType = {
        name,
        accountName,
        amount: parsedAmount,
        cardType,
        isActive: !isDisable,
        color,
      };
      if (account?.id && onUpdateAccount) {
        onUpdateAccount({ ...newAccount, id: account.id });
      } else if (onAddAccount) {
        onAddAccount(newAccount);
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, gap: 16 }}>
        <PillSelector
          options={accountCardOptions}
          selected={cardType}
          onSelect={setCardType}
        />

        <View>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter Account holder name"
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        <View>
          <TextInput
            style={styles.input}
            value={accountName}
            onChangeText={setAccountName}
            placeholder="Enter Account Name"
          />
          {errors.accountName && (
            <Text style={styles.errorText}>{errors.accountName}</Text>
          )}
        </View>

        <View>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            placeholder="Enter Amount"
            keyboardType="numeric"
          />

          {errors.amount && (
            <Text style={styles.errorText}>{errors.amount}</Text>
          )}
        </View>

        <Picker variant="color" value={color} onSelect={setColor} />

        <View style={styles.switchContainer}>
          <Text style={styles.label}>Exclude Account:</Text>
          <Switch value={isDisable} onValueChange={setIsDisable} />
        </View>
      </View>
      {(onAddAccount || onUpdateAccount) && (
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateAccount}
        >
          <Text style={styles.createButtonText}>
            {onUpdateAccount ? "Update" : "Create"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: "red",
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
  createButton: {
    backgroundColor: materialTheme.primary,
    paddingVertical: 15,
    borderRadius: 32,
    alignItems: "center",
  },
  createButtonText: {
    color: materialTheme.onPrimary,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AccountForm;
