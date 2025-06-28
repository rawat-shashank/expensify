import { materialTheme } from "@/constants";
import { floatTwoDecFromString } from "@/utilities/helpers";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  KeyboardTypeOptions,
  TextStyle,
} from "react-native";

export interface InputFieldProps {
  value: string;
  error?: string;
  placeholder?: string;
  onUpdate?: (value: string) => void;
  style?: TextStyle;
  keyboardType?: KeyboardTypeOptions;
}

export const InputField = ({
  value,
  error = "",
  placeholder = "Enter Input",
  onUpdate,
  style,
  keyboardType = "default",
}: InputFieldProps) => {
  const onChange = (value: string) => {
    if (!onUpdate) {
      return;
    }
    if (keyboardType === "numeric") {
      onUpdate(floatTwoDecFromString(value));
    } else {
      onUpdate(value);
    }
  };

  return (
    <View>
      <TextInput
        style={[styles.input, style]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        keyboardType={keyboardType}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
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
  errorText: {
    color: materialTheme.error,
  },
});
