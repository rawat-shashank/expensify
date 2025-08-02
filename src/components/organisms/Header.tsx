import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Text, Icons, IconsNameType } from "../atoms";
import { useTheme } from "@/context/ThemeContext";
import { FONT_SIZES } from "@/constants";
import { SPACINGS } from "@/constants/sizes";

interface HeaderProps {
  title: string;
  leftIcon?: IconsNameType;
  onLeftIconPress?: () => void;
  rightIcon?: IconsNameType;
  onRightIconPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  leftIcon,
  onLeftIconPress,
  rightIcon,
  onRightIconPress,
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.header}>
      <View style={styles.leftSection}>
        {leftIcon && (
          <TouchableOpacity onPress={onLeftIconPress}>
            <Icons
              name={leftIcon}
              size={FONT_SIZES.h3}
              color={theme.onSurface}
            />
          </TouchableOpacity>
        )}
        <Text size={FONT_SIZES.h4} color={theme.onSurface} style={styles.title}>
          {title}
        </Text>
      </View>

      {rightIcon && (
        <TouchableOpacity onPress={onRightIconPress}>
          <Icons
            name={rightIcon}
            size={FONT_SIZES.h3}
            color={theme.onSurface}
            variant="circularBackground"
            backgroundColor={theme.tertiaryContainer}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: SPACINGS.xs,
    paddingHorizontal: SPACINGS.md,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  title: {
    fontWeight: "bold",
    marginLeft: SPACINGS.md,
  },
});
