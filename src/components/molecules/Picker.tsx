import { Fragment, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { WINDOW_HEIGHT, WINDOW_WIDTH } from "@/constants";
import {
  TouchableButton,
  Icons,
  IconsNameType,
  ICON_NAME_MAPPING,
  ColorDotWithRing,
  CustomSheet,
  ColorPicker,
  Text,
} from "../atoms";

const ALL_ICON_NAMES = Object.keys(ICON_NAME_MAPPING);
const ICON_SIZE_IN_PICKER = 40;
const PADDING = 8; // Adjust as needed
const NUM_COLUMNS = Math.floor(
  (WINDOW_WIDTH - PADDING * 2) / ICON_SIZE_IN_PICKER,
);

type PickerProps =
  | {
      variant: "color";
      value: string;
      onSelect: (selectedValue: string) => void;
      label?: string;
      description?: string;
      defaultIcon?: IconsNameType;
    }
  | {
      variant: "icon";
      value: IconsNameType;
      onSelect: (selectedValue: IconsNameType) => void;
      label?: string;
      description?: string;
      defaultIcon?: IconsNameType;
    };

export const Picker = ({
  variant,
  value,
  onSelect,
  label,
  description,
  defaultIcon = "star",
}: PickerProps) => {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  const handleSelectAndClose = (selectedValue: string | IconsNameType) => {
    if (variant === "color") {
      (onSelect as (val: string) => void)(selectedValue as string);
    } else {
      (onSelect as (val: IconsNameType) => void)(
        selectedValue as IconsNameType,
      );
    }
    setIsVisible(false);
  };

  const displayIconName =
    variant === "icon" ? value || defaultIcon : "color-palette";

  return (
    <Fragment>
      <TouchableButton
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 10,
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
          {variant === "color" ? (
            <Icons name="color-palette" color={theme.primary} />
          ) : (
            <Icons
              name={displayIconName as IconsNameType}
              color={theme.primary}
            />
          )}

          <View>
            <Text style={{ color: theme.onSurface }}>
              {label || (variant === "color" ? "Pick Color" : "Pick Icon")}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: theme.onSurfaceVariant,
              }}
            >
              {description ||
                (variant === "color"
                  ? "Set color for your category"
                  : "Set icon for your category")}
            </Text>
          </View>
        </View>

        {variant === "color" ? (
          <ColorDotWithRing color={value || theme.primary} />
        ) : (
          <Icons
            name={(value as IconsNameType) || (defaultIcon as IconsNameType)}
            size={30}
            color={theme.primary}
          />
        )}
      </TouchableButton>

      <CustomSheet isVisible={isVisible} onClose={() => setIsVisible(false)}>
        {variant === "color" ? (
          <ColorPicker onSelect={handleSelectAndClose} />
        ) : (
          <View style={styles.iconPickerContainer}>
            <Text color={theme.onSurface} style={styles.pickerHeader}>
              Select an Icon
            </Text>

            <FlatList
              data={ALL_ICON_NAMES}
              keyExtractor={(item) => item}
              numColumns={NUM_COLUMNS}
              renderItem={({ item: iconName }) => (
                <TouchableButton
                  style={styles.iconItem}
                  onPress={() => handleSelectAndClose(iconName)}
                >
                  <Icons
                    name={iconName as IconsNameType}
                    size={ICON_SIZE_IN_PICKER - 10}
                    color={
                      value === iconName
                        ? theme.primary
                        : theme.onSurfaceVariant
                    }
                  />
                </TouchableButton>
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
    paddingTop: 20,
    height: WINDOW_HEIGHT,
  },
  pickerHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  iconListContent: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  iconItem: {
    width: ICON_SIZE_IN_PICKER,
    height: ICON_SIZE_IN_PICKER,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    borderRadius: 8,
  },
});
