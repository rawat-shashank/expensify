import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import colors from "@/constants/colors";
import { Icons } from "./Icons";

interface HeaderProps {
  title: string;
  onProfilePress: () => void;
  menuIconName?: string;
  profileIconName?: string;
}

const Header: React.FC<HeaderProps> = ({ title, onProfilePress }) => {
  return (
    <View style={styles.header}>
      <View style={styles.leftSection}>
        <TouchableOpacity onPress={() => console.log("Menu Pressed")}>
          <Icons name="menu" size={28} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
      </View>

      <TouchableOpacity onPress={onProfilePress}>
        <Icons
          name="person-circle-outline"
          size={28}
          color={colors.textPrimary}
          variant="circularBackground"
          backgroundColor={colors.accrentBg}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 0,
    paddingHorizontal: 8,
    backgroundColor: colors.bg,
    borderBottomWidth: 1,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 16,
    color: colors.textPrimary,
  },
});

export default Header;
