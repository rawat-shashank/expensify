import { Switch, Text, View, StyleSheet } from "react-native";
import {
  AccountCardTypeEnum,
  AccountType,
  CreateAccountType,
} from "@/database/accountsSchema";
import { useState } from "react";

import { useTheme } from "@/context/ThemeContext";
import {
  InputField,
  TouchableButton,
  PillSelector,
  CurrencyInput,
} from "../../atoms/";
import { Picker } from "@/components/molecules";

const AccountForm = ({
  account,
  onAddAccount,
  onUpdateAccount,
}: {
  account?: AccountType;
  onAddAccount?: (newAccount: CreateAccountType) => Promise<void>;
  onUpdateAccount?: (newAccount: AccountType) => Promise<void>;
}) => {
  const { theme } = useTheme();
  const accountCardOptions: AccountCardTypeEnum[] = [
    AccountCardTypeEnum.CASH,
    AccountCardTypeEnum.WALLET,
    AccountCardTypeEnum.BANK,
  ];

  const [name, setName] = useState(account?.name || "");
  const [accountName, setAccountName] = useState(account?.accountName || "");
  const [amount, setAmount] = useState(account?.amount.toString() || "");
  const [isDisable, setIsDisable] = useState<boolean>(false);
  const [cardType, setCardType] = useState<AccountCardTypeEnum>(
    AccountCardTypeEnum.CASH,
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

    const parsedAmount = parseFloat(amount || "0.00");
    if (isNaN(parsedAmount)) {
      newErrors.amount = "Amount must be a valid number.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const newAccount: CreateAccountType = {
        name,
        accountName,
        amount: amount || "0.00",
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

        <InputField
          value={name}
          onUpdate={setName}
          placeholder="Enter Accountholder name"
          error={errors.name}
        />

        <InputField
          value={accountName}
          onUpdate={setAccountName}
          placeholder="Enter Account name"
          error={errors.accountName}
        />

        <CurrencyInput
          value={amount}
          onUpdate={setAmount}
          placeholder="0.00"
          error={errors.amount}
        />

        <Picker variant="color" value={color} onSelect={setColor} />

        <View style={styles.switchContainer}>
          <Text style={[styles.label, { color: theme.onSurface }]}>
            Exclude Account:
          </Text>
          <Switch value={isDisable} onValueChange={setIsDisable} />
        </View>
      </View>
      {(onAddAccount || onUpdateAccount) && (
        <TouchableButton variant="submit" onPress={handleCreateAccount}>
          <Text
            style={[
              styles.createButtonText,
              {
                color: theme.onPrimary,
              },
            ]}
          >
            {onUpdateAccount ? "Update" : "Create"}
          </Text>
        </TouchableButton>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  createButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AccountForm;
