import React, { useState, useEffect } from "react";
import { TextInput, View, StyleSheet } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { Text } from "../atoms";

// Define the properties (props) for the CurrencyInput component.
interface CurrencyInputProps {
  value: string;
  placeholder?: string | undefined;
  onUpdate: (value: string) => void;
  currencySymbol?: string;
  locale?: string;
  error?: string;
}

const CurrencyInput = ({
  value,
  placeholder = "0.00",
  onUpdate,
  error,
}: CurrencyInputProps) => {
  const { theme } = useTheme();
  const [internalValue, setInternalValue] = useState(
    value ? String(value) : "",
  );

  useEffect(() => {
    // Update internal value if the external 'value' prop changes
    if (parseFloat(value) !== parseFloat(internalValue)) {
      setInternalValue(value ? String(value) : "");
    }
  }, [value]);

  const handleChangeText = (text: string) => {
    // Allow only numbers and a single decimal point
    const cleanedText = text.replace(/[^0-9.]/g, "");

    // Ensure only one decimal point
    const parts = cleanedText.split(".");
    if (parts.length > 2) {
      // If more than one dot, keep only the first part and the first character after the second dot
      setInternalValue(`${parts[0]}.${parts[1].substring(0, 2)}`);
      return;
    }

    // Restrict to two digits after the decimal point
    if (parts[1] && parts[1].length > 2) {
      setInternalValue(`${parts[0]}.${parts[1].substring(0, 2)}`);
      return;
    }

    setInternalValue(cleanedText);
  };

  const handleBlur = () => {
    let formattedValue = internalValue;

    if (formattedValue === "" || formattedValue === ".") {
      formattedValue = "0.00";
    } else if (formattedValue.endsWith(".")) {
      formattedValue += "00";
    } else if (!formattedValue.includes(".")) {
      formattedValue += ".00";
    } else {
      const parts = formattedValue.split(".");
      if (parts[1].length === 0) {
        formattedValue += "00";
      } else if (parts[1].length === 1) {
        formattedValue += "0";
      }
    }

    // Ensure it's a valid number before updating the external value
    const numericValue = parseFloat(formattedValue);
    if (!isNaN(numericValue)) {
      const value = String(numericValue.toFixed(2));
      setInternalValue(value);
      onUpdate(value);
    } else {
      setInternalValue("0.00");
      onUpdate("0.00");
    }
  };

  return (
    <View>
      <TextInput
        style={[styles.input, { color: theme.onSurface }]}
        keyboardType="numeric"
        value={internalValue}
        onChangeText={handleChangeText}
        onBlur={handleBlur}
        placeholder={placeholder}
        placeholderTextColor={theme.onSurfaceVariant}
      />

      {error && <Text color={theme.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
  },
});

export default CurrencyInput;
