import {
  View,
  StyleSheet,
  TextInput,
  KeyboardTypeOptions,
  TextStyle,
} from "react-native";

import { useUserAccount } from "@/context/UserAccountContext";
import { floatTwoDecFromString } from "@/utilities/helpers";
import { FONT_SIZES } from "@/constants";
import { SPACINGS } from "@/constants/sizes";

import { Text } from "@/components/atoms";

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
  const { theme } = useUserAccount();
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
        style={[
          styles.input,
          style,
          { color: theme.onSurface, borderColor: theme.onSurface },
        ]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        keyboardType={keyboardType}
        placeholderTextColor={theme.onSurfaceVariant}
      />
      {error && (
        <Text
          size={FONT_SIZES.small}
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
    borderRadius: SPACINGS.md,
    padding: SPACINGS.md,
    fontSize: SPACINGS.md,
  },
});
