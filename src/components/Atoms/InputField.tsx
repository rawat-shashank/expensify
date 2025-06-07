import { View, StyleSheet, Text, TextInput } from "react-native";
import { ViewStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes";

export interface InputFieldProps {
  value: string;
  error?: string;
  placeholder?: string;
  onUpdate?: (value: string) => void;
  style?: ViewStyle;
}

export const InputField = ({
  value,
  error = "",
  placeholder = "Enter Input",
  onUpdate,
  style,
}: InputFieldProps) => {
  return (
    <View>
      <TextInput
        style={[styles.input, style]}
        value={value}
        onChangeText={onUpdate}
        placeholder={placeholder}
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
    color: "red",
  },
});
