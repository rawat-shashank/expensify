import React from "react";
import { Entypo, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { View, StyleSheet, ViewStyle } from "react-native";

import { FONT_SIZES } from "@/constants";

// Define the icon type mapping in order of preference
const iconTypeMapping = {
  Entypo,
  Ionicons,
  MaterialCommunityIcons,
};

// Create a union type of all available icon names
type IconsNameType =
  | keyof typeof Entypo.glyphMap
  | keyof typeof Ionicons.glyphMap
  | keyof typeof MaterialCommunityIcons.glyphMap;

// Dynamically generate the icon mapping, prioritizing based on the order in iconTypeMapping
const ICON_NAME_MAPPING = Object.entries(iconTypeMapping).reduce(
  (acc, [_, component]) => {
    const iconNames = Object.keys(component.glyphMap);
    iconNames.forEach((name) => {
      // Only add the icon if it doesn't already exist in the mapping
      if (!acc[name]) {
        acc[name] = {
          component: component as any,
          name: name as any,
        };
      }
    });
    return acc;
  },
  {} as Record<string, { component: React.ComponentType<any>; name: string }>,
);

interface IconProps {
  name: IconsNameType;
  size?: number;
  color?: string;
  style?: ViewStyle;
  variant?: "default" | "circularBackground" | "pillBackground";
  backgroundColor?: string;
}

const Icons: React.FC<IconProps> = ({
  name,
  size = FONT_SIZES.h4,
  color = "black",
  style,
  variant = "default",
  backgroundColor = "transparent",
}) => {
  const iconDefinition = ICON_NAME_MAPPING[name as string];

  if (!iconDefinition) {
    console.warn(`Icon "${name}" not found in ICON_NAME_MAPPING`);
    return null;
  }

  const { component: IconComponent, name: iconName } = iconDefinition;

  switch (variant) {
    case "circularBackground":
      return (
        <View
          style={[
            styles.circularBackgroundContainer,
            {
              width: size * 1.6,
              height: size * 1.6,
              borderRadius: (size * 1.6) / 2,
              backgroundColor: backgroundColor,
            },
            style,
          ]}
        >
          <IconComponent name={iconName} size={size} color={color} />
        </View>
      );

    case "pillBackground":
      return (
        <View
          style={[
            styles.circularBackgroundContainer,
            {
              width: size * 2.8,
              height: size * 1.5,
              borderRadius: (size * 1.5) / 2,
              backgroundColor,
            },
            style,
          ]}
        >
          <IconComponent name={iconName} size={size} color={color} />
        </View>
      );
    case "default":
    default:
      return (
        <IconComponent
          name={iconName}
          size={size}
          color={color}
          style={style}
        />
      );
  }
};

const styles = StyleSheet.create({
  circularBackgroundContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export { Icons, IconsNameType, ICON_NAME_MAPPING };
