import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, Animated } from "react-native";
import { Icons, IconsNameType } from "./atoms";
import { ViewStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes";
import { useTheme } from "@/context/ThemeContext";

interface FABProps {
  onPress: () => void;
  iconName?: IconsNameType;
  buttonColor?: string;
  iconColor?: string;
  iconSize?: number;
  style?: ViewStyle;
}

const FloatingActionButton = ({
  onPress,
  iconName = "plus",
  iconColor,
  buttonColor,
  iconSize = 28,
  style,
}: FABProps) => {
  const { theme } = useTheme();
  const iconScale = 2 * iconSize;
  const iconborder = iconSize / 2;
  const [animation] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(animation, {
      toValue: 0.95,
      useNativeDriver: true,
      friction: 5,
      tension: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(animation, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
      tension: 10,
    }).start(() => {
      if (onPress) {
        onPress();
      }
    });
  };

  const animatedStyle = {
    transform: [{ scale: animation }],
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: iconScale,
          height: iconScale,
          borderRadius: iconborder,
        },
        animatedStyle,
        style,
      ]}
    >
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: buttonColor || theme.tertiary,
            width: iconScale,
            height: iconScale,
            borderRadius: iconborder,
          },
        ]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <Icons name={iconName} color={iconColor} size={iconSize} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FloatingActionButton;
