import { Fragment, useState } from "react";
import { View, StyleSheet, FlatList, KeyboardAvoidingView } from "react-native";

import { WINDOW_WIDTH, ICON_SIZE_IN_PICKER, ICONS_PER_PAGE } from "@/constants";
import { FONT_SIZES, SPACINGS } from "@/constants/sizes";
import { useUserAccount } from "@/context/UserAccountContext";

import {
  TouchableButton,
  Icons,
  IconsNameType,
  ICON_NAME_MAPPING,
  ColorDotWithRing,
  CustomSheet,
  Text,
} from "@/components/atoms";
import { ColorPicker, InputField } from "@/components/molecules";

const ALL_ICON_NAMES = Object.keys(ICON_NAME_MAPPING);

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
  const [searchQuery, setSearchQuery] = useState("");

  const filteredIcons = ALL_ICON_NAMES.filter((iconName) =>
    iconName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSelectAndClose = (selectedValue: string | IconsNameType) => {
    if (variant === "color") {
      (onSelect as (val: string) => void)(selectedValue as string);
    } else {
      (onSelect as (val: IconsNameType) => void)(
        selectedValue as IconsNameType,
      );
    }
    setSearchQuery("");
    setIsVisible(false);
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
          <KeyboardAvoidingView
            style={{
              flex: 1,
            }}
            behavior="height"
          >
            <Text
              size={FONT_SIZES.h5}
              color={theme.onSurface}
              style={styles.pickerHeader}
            >
              Select an Icon
            </Text>
            <InputField
              placeholder="Search icons..."
              onUpdate={(text) => {
                setSearchQuery(text);
              }}
              value={searchQuery}
            />
            <FlatList
              data={filteredIcons}
              renderItem={renderIconItem}
              keyExtractor={(item) => item}
              numColumns={Math.floor(WINDOW_WIDTH / ICON_SIZE_IN_PICKER)}
              contentContainerStyle={styles.pillListContentContainer}
            />
          </KeyboardAvoidingView>
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
