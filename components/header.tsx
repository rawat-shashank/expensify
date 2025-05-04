import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Or any other icon library you prefer

interface HeaderProps {
  title: string;
  onProfilePress: () => void;
  menuIconName?: string; // Optional, with default value
  profileIconName?: string; // Optional, with default value
}

const Header: React.FC<HeaderProps> = ({ title, onProfilePress }) => {
  return (
    <View style={styles.header}>
      {/* Left Section */}
      <View style={styles.leftSection}>
        <TouchableOpacity onPress={() => console.log("Menu Pressed")}>
          <Ionicons name="menu" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Right Section */}
      <TouchableOpacity style={styles.rightSection} onPress={onProfilePress}>
        <Ionicons name="person-circle-outline" size={28} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 16,
    backgroundColor: "#f8f8f8", // Example background color
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 16,
  },
  rightSection: {
    // No specific styles needed for the container in this case
  },
});

export default Header;
