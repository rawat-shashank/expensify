import { Fragment, useState } from "react";
import { View, FlatList, StyleSheet, ScrollView } from "react-native";

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
  Container,
} from "../atoms";
import { FONT_SIZES, SPACINGS } from "@/constants/sizes";

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
          paddingVertical: SPACINGS.xs,
        }}
        onPress={() => setIsVisible(true)}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: SPACINGS.md,
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
            <Text color={theme.onSurface}>
              {label || (variant === "color" ? "Pick Color" : "Pick Icon")}
            </Text>
            <Text size={FONT_SIZES.caption} color={theme.onSurfaceVariant}>
              {description ||
                (variant === "color"
                  ? "Set color for your category"
                  : "Set icon for your category")}
            </Text>
          </View>
        </View>

        {variant === "color" ? (
          <ColorDotWithRing
            size={FONT_SIZES.h3}
            color={value || theme.primary}
          />
        ) : (
          <Icons
            name={(value as IconsNameType) || (defaultIcon as IconsNameType)}
            size={FONT_SIZES.h3}
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
            <ScrollView
              horizontal={false}
              contentContainerStyle={styles.pillListContentContainer}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
            >
              {ALL_ICON_NAMES.map((item) => {
                return (
                  <TouchableButton
                    key={item}
                    onPress={() => handleSelectAndClose(item)}
                    style={styles.iconItem}
                  >
                    <Icons
                      name={item as IconsNameType}
                      size={ICON_SIZE_IN_PICKER - 10}
                      color={
                        value === item ? theme.primary : theme.onSurfaceVariant
                      }
                    />
                  </TouchableButton>
                );
              })}
            </ScrollView>
          </View>
        )}
      </CustomSheet>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  pillListContentContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACINGS.xs,
  },
  pickerHeader: {
    fontWeight: "bold",
  },
  iconItem: {
    width: ICON_SIZE_IN_PICKER,
    height: ICON_SIZE_IN_PICKER,
    justifyContent: "center",
    alignItems: "center",
    gap: SPACINGS.tiny,
    borderRadius: SPACINGS.xs,
  },
});
