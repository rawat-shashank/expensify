import { useTheme } from "@/context/ThemeContext";
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
  const { theme } = useTheme();
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
        style={[styles.input, style, { color: theme.onSurface }]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        keyboardType={keyboardType}
      />
      {error && (
        <Text
          style={{
            color: theme.error,
          }}
        >
          {error}
        </Text>
      )}
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
