import { Fragment, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";

import { WINDOW_WIDTH } from "@/constants";
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
import { FONT_SIZES, SPACINGS } from "@/constants/sizes";
import { useUserAccount } from "@/context/UserAccountContext";

const ALL_ICON_NAMES = Object.keys(ICON_NAME_MAPPING);
const ICON_SIZE_IN_PICKER = 40;
const ICONS_PER_PAGE = 100;

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
  const { theme } = useUserAccount();
  const [isVisible, setIsVisible] = useState(false);
  const [displayedIcons, setDisplayedIcons] = useState(
    ALL_ICON_NAMES.slice(0, ICONS_PER_PAGE),
  );
  const [isLoading, setIsLoading] = useState(false);

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

  const loadMoreIcons = () => {
    if (isLoading || displayedIcons.length >= ALL_ICON_NAMES.length) {
      return;
    }

    setIsLoading(true);
    const nextIconsLength = displayedIcons.length + ICONS_PER_PAGE;
    // We can remove the setTimeout since this is local data and doesn't need to mimic a network request.
    setDisplayedIcons(ALL_ICON_NAMES.slice(0, nextIconsLength));
    setIsLoading(false);
  };

  const renderIconItem = ({ item }: { item: string }) => {
    return (
      <TouchableButton
        onPress={() => handleSelectAndClose(item)}
        style={styles.iconItem}
      >
        <Icons
          name={item as IconsNameType}
          size={ICON_SIZE_IN_PICKER - 10}
          color={value === item ? theme.primary : theme.onSurfaceVariant}
        />
      </TouchableButton>
    );
  };

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
            <Icons name="home" color={theme.primary} />
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
          <View>
            <Text
              size={FONT_SIZES.h5}
              color={theme.onSurface}
              style={styles.pickerHeader}
            >
              Select an Icon
            </Text>
            <FlatList
              data={displayedIcons}
              renderItem={renderIconItem}
              keyExtractor={(item) => item}
              numColumns={Math.floor(WINDOW_WIDTH / ICON_SIZE_IN_PICKER)}
              contentContainerStyle={styles.pillListContentContainer}
              onEndReached={loadMoreIcons}
              onEndReachedThreshold={0.5}
            />
          </View>
        )}
      </CustomSheet>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  pillListContentContainer: {
    paddingVertical: SPACINGS.sm,
    gap: SPACINGS.xs,
    justifyContent: "center",
  },
  pickerHeader: {
    fontWeight: "bold",
    marginVertical: SPACINGS.tiny,
  },
  iconItem: {
    width: ICON_SIZE_IN_PICKER,
    height: ICON_SIZE_IN_PICKER,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: SPACINGS.xs,
  },
});
