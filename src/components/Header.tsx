import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Icons, IconsName } from "./Atoms/Icons";
import { useTheme } from "@/context/ThemeContext";

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
  const { theme } = useTheme();

  return (
    <View style={styles.header}>
      <View style={styles.leftSection}>
        {leftIcon && (
          <TouchableOpacity onPress={onLeftIconPress}>
            <Icons name={leftIcon} size={28} color={theme.onSurface} />
          </TouchableOpacity>
        )}
        <Text
          style={[
            styles.title,
            {
              color: theme.onSurface,
            },
          ]}
        >
          {title}
        </Text>
      </View>

      {rightIcon && (
        <TouchableOpacity onPress={onRightIconPress}>
          <Icons
            name={rightIcon}
            size={28}
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
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 16,
  },
});

export default Header;
