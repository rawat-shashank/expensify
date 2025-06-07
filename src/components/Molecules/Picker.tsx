import { Fragment, useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  FlatList,
  StyleSheet,
} from "react-native"; // Added FlatList, Dimensions, StyleSheet
import { CustomSheet } from "../customSheet";
import ColorPicker from "../Pickers/ColorPicker";
import { materialTheme, WINDOW_HEIGHT, WINDOW_WIDTH } from "@/constants";
import { Icons, IconsName, ICON_NAME_MAPPING } from "../Atoms/Icons";
import { ColorDotWithRing } from "../UI/ColorDotWithRing";

// Get all icon names for display in the picker
const ALL_ICON_NAMES = Object.keys(ICON_NAME_MAPPING);

// Determine the number of columns for the icon picker grid
const ICON_SIZE_IN_PICKER = 40; // Adjust as needed
const PADDING = 8; // Adjust as needed
const NUM_COLUMNS = Math.floor(
  (WINDOW_WIDTH - PADDING * 2) / ICON_SIZE_IN_PICKER,
);

// Define the props for the Picker component
interface PickerProps {
  variant: "color" | "icon";
  // Value can be a color string OR an icon name string
  value: string;
  // onSelect will pass back a color string OR an icon name string
  onSelect: (selectedValue: string) => void;
  label?: string; // Optional label for the picker
  description?: string; // Optional description
  // If variant is "icon", you might want a default icon to display when no value is set
  defaultIcon?: IconsName;
}

export const Picker = ({
  variant,
  value,
  onSelect,
  label,
  description,
  defaultIcon = "star", // Default icon if none is provided for icon variant
}: PickerProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleSelectAndClose = (selectedValue: string) => {
    onSelect(selectedValue);
    setIsVisible(false);
  };

  const displayIconName =
    variant === "icon" ? value || defaultIcon : "color-palette"; // Display selected icon or default, or palette icon

  return (
    <Fragment>
      <TouchableOpacity
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 10, // Add some padding for better touch area
        }}
        onPress={() => setIsVisible(true)}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 16,
            alignItems: "center",
          }}
        >
          {/* Display relevant icon based on variant */}
          {variant === "color" ? (
            <Icons name="color-palette" color={materialTheme.primary} />
          ) : (
            // The `name` prop for `Icons` is `string`, but we know `displayIconName` is `IconsName`
            <Icons
              name={displayIconName as IconsName}
              color={materialTheme.primary}
            />
          )}

          <View>
            <Text>
              {label || (variant === "color" ? "Pick Color" : "Pick Icon")}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: materialTheme.onSecondaryContainer,
              }}
            >
              {description ||
                (variant === "color"
                  ? "Set color for your category"
                  : "Set icon for your category")}
            </Text>
          </View>
        </View>

        {/* Display selected value representation */}
        {variant === "color" ? (
          <ColorDotWithRing color={value || materialTheme.primary} />
        ) : (
          // Display the selected icon, or a placeholder if none is selected
          <Icons
            name={(value as IconsName) || (defaultIcon as IconsName)}
            size={30}
            color={materialTheme.primary}
          />
        )}
      </TouchableOpacity>

      <CustomSheet isVisible={isVisible} onClose={() => setIsVisible(false)}>
        {variant === "color" ? (
          <ColorPicker onSelect={handleSelectAndClose} />
        ) : (
          <View style={styles.iconPickerContainer}>
            <Text style={styles.pickerHeader}>Select an Icon</Text>
            <FlatList
              data={ALL_ICON_NAMES}
              keyExtractor={(item) => item}
              numColumns={NUM_COLUMNS}
              renderItem={({ item: iconName }) => (
                <TouchableOpacity
                  style={styles.iconItem}
                  onPress={() => handleSelectAndClose(iconName)}
                >
                  <Icons
                    name={iconName as IconsName} // Assert the name is one of the valid icon names
                    size={ICON_SIZE_IN_PICKER - 10} // Smaller size for picker items
                    color={
                      value === iconName
                        ? materialTheme.primary
                        : materialTheme.onSurfaceVariant
                    }
                  />
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.iconListContent}
            />
          </View>
        )}
      </CustomSheet>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  iconPickerContainer: {
    padding: PADDING,
    paddingTop: 20, // Adjust as needed
    height: WINDOW_HEIGHT,
  },
  pickerHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: materialTheme.onSurface,
  },
  iconListContent: {
    justifyContent: "flex-start", // Align items to the start
    alignItems: "flex-start", // Align items to the start
  },
  iconItem: {
    width: ICON_SIZE_IN_PICKER,
    height: ICON_SIZE_IN_PICKER,
    justifyContent: "center",
    alignItems: "center",
    margin: 5, // Spacing between icons
    borderRadius: 8,
    // Add a subtle border or background if you like for better visibility
    // backgroundColor: '#f0f0f0',
    // borderWidth: 1,
    // borderColor: '#e0e0e0',
  },
});
