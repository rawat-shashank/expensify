import DateTimeInput from "@/components/Atoms/DateTimeInput";
import { InputField } from "@/components/Atoms/InputField";
import { AccountCardList } from "@/components/Molecules/AccountCardList";
import { CategoryPillList } from "@/components/Molecules/CategoryPillList";
import { materialTheme } from "@/constants";
import {
  AddTransactionType,
  TransactionType,
  TransactionTypeEnum,
} from "@/database/transactionSchema";
import useAccounts from "@/queries/useAccounts";
import useCategories from "@/queries/useCategories";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { PillSelector } from "../../Atoms/PillSelector";
import { TouchableButton } from "../../Atoms/TouchableButtons";
import CurrencyInput from "@/components/Atoms/CurrencyInput";

interface TransactionFormProps {
  transaction?: TransactionType;
  onAddTransaction?: (newTransaction: AddTransactionType) => Promise<void>;
  onUpdateTransaction?: (transaction: TransactionType) => Promise<void>;
}

interface TransactionFormErrors {
  name?: string;
  amount?: string;
  account_id?: string;
  category_id?: string;
}

export const TransactionForm = ({
  transaction,
  onAddTransaction,
  onUpdateTransaction,
}: TransactionFormProps) => {
  // TODO: Add Transaction type for Transfer
  const transactionTypeOptions: TransactionTypeEnum[] = [
    TransactionTypeEnum.EXPENSE,
    TransactionTypeEnum.INCOME,
  ];

  const db = useSQLiteContext();
  const { accounts } = useAccounts(db);
  const { categories } = useCategories(db);

  const [name, setName] = useState(transaction?.name || "");
  const [amount, setAmount] = useState(transaction?.amount.toString() || "");
  const [desc, setDesc] = useState(transaction?.desc || "");
  const [time, setTime] = useState(
    transaction?.time || new Date().toISOString(),
  );
  const [account_id, setAccountId] = useState(transaction?.account_id || -1);
  const [category_id, setCategoryId] = useState(transaction?.category_id || -1);

  const [type, setType] = useState<TransactionTypeEnum>(
    transaction?.type || TransactionTypeEnum.EXPENSE,
  );
  const [errors, setErrors] = useState<TransactionFormErrors>({});

  const handleCreateTransaction = async () => {
    const newErrors: TransactionFormErrors = {};
    if (!name.trim()) {
      newErrors.name = "Expense name required.";
    }

    const paresedAmount = parseFloat(amount || "0.00");
    if (isNaN(paresedAmount)) {
      newErrors.amount = "Amount must be a valid number.";
    }

    if (account_id < 0) {
      newErrors.account_id = "Account required.";
    }

    if (category_id < 0) {
      newErrors.category_id = "Category required.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const newTransaction: AddTransactionType = {
        name,
        desc,
        amount: amount || "0.00",
        time,
        account_id,
        category_id,
        type,
      };
      if (transaction?.id && onUpdateTransaction) {
        onUpdateTransaction({ ...newTransaction, id: transaction.id });
      } else if (onAddTransaction) {
        onAddTransaction(newTransaction);
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ marginBottom: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flex: 1, gap: 16 }}>
          <PillSelector
            options={transactionTypeOptions}
            selected={type}
            onSelect={setType}
          />

          <InputField
            value={name}
            onUpdate={setName}
            placeholder="Expense name"
            error={errors.name}
          />
          <CurrencyInput
            value={amount}
            onUpdate={setAmount}
            placeholder="0.00"
            error={errors.amount}
          />

          <InputField
            value={desc}
            onUpdate={setDesc}
            placeholder="Description"
          />
          <DateTimeInput label="Date & time" value={time} onChange={setTime} />
          <AccountCardList
            activeAccountId={account_id}
            onSelect={setAccountId}
            accounts={accounts}
            error={errors.account_id}
          />
          <CategoryPillList
            categories={categories}
            activeCategoryId={category_id}
            onSelect={setCategoryId}
            error={errors.category_id}
          />
        </View>
      </ScrollView>
      {(onAddTransaction || onUpdateTransaction) && (
        <TouchableButton variant="submit" onPress={handleCreateTransaction}>
          <Text style={styles.createButtonText}>
            {onUpdateTransaction ? "Update" : "Create"}
          </Text>
        </TouchableButton>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  createButtonText: {
    color: materialTheme.onPrimary,
    fontSize: 16,
    fontWeight: "bold",
  },
});
