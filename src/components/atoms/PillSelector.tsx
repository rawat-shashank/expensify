import { useTheme } from "@/context/ThemeContext";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { Text } from "../atoms";

interface PillSelectorProps<T extends string> {
  options: T[];
  selected: T;
  onSelect: (value: T) => void;
}

export const PillSelector = <T extends string>({
  options,
  selected,
  onSelect,
}: PillSelectorProps<T>) => {
  const { theme } = useTheme();
  return (
    <View style={styles.pillContainer}>
      {options?.map((option) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.typeButton,
            {
              backgroundColor: theme.tertiaryContainer,
            },
            selected === option && {
              borderWidth: 2,
              borderColor: theme.onSurface,
            },
          ]}
          onPress={() => onSelect(option)}
        >
          <Text
            color={
              selected === option ? theme.onSurface : theme.onSurfaceVariant
            }
            style={{
              textTransform: "capitalize",
            }}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  pillContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 5,
    gap: 16,
  },
  typeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 32,
  },
  activeTypeButton: {},
  typeButtonText: {
    fontSize: 16,
    textTransform: "capitalize",
  },
});
