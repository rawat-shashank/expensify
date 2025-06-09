import { materialTheme } from "@/constants";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
  return (
    <View style={styles.pillContainer}>
      {options?.map((option) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.typeButton,
            selected === option && styles.activeTypeButton,
          ]}
          onPress={() => onSelect(option)}
        >
          <Text
            style={[
              styles.typeButtonText,
              selected === option && styles.activeTypeButtonText,
            ]}
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
    backgroundColor: materialTheme.tertiaryContainer,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 32,
  },
  activeTypeButton: {
    borderWidth: 2,
    borderColor: materialTheme.onSurface,
  },
  typeButtonText: {
    fontSize: 16,
    color: materialTheme.onSurfaceVariant,
    textTransform: "capitalize",
  },
  activeTypeButtonText: {
    color: materialTheme.onSurface,
  },
});
