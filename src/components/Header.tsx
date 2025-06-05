import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { materialTheme } from "@/constants";
import { Icons, IconsName } from "./Icons";

interface HeaderProps {
  title: string;
  leftIcon?: IconsName;
  onLeftIconPress?: () => void;
  rightIcon?: IconsName;
  onRightIconPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title,
  leftIcon,
  onLeftIconPress,
  rightIcon,
  onRightIconPress,
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.leftSection}>
        {leftIcon && (
          <TouchableOpacity onPress={onLeftIconPress}>
            <Icons name={leftIcon} size={28} color={materialTheme.onSurface} />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>{title}</Text>
      </View>

      {rightIcon && (
        <TouchableOpacity onPress={onRightIconPress}>
          <Icons
            name={rightIcon}
            size={28}
            color={materialTheme.onSurface}
            variant="circularBackground"
            backgroundColor={materialTheme.tertiaryContainer}
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
    paddingBottom: 8,
    paddingHorizontal: 16,
    backgroundColor: materialTheme.background,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 16,
    color: materialTheme.onSurface,
  },
});

export default Header;
