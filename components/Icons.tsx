import React from "react";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";
import { ViewStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes";

type IconsName = keyof typeof Entypo.glyphMap | keyof typeof Ionicons.glyphMap;

type IconMappingValue = {
  component: React.ComponentType<any>;
  name: IconsName;
};

const ICON_NAME_MAPPING: { [key: string]: IconMappingValue } = {
  plus: { component: Entypo, name: "plus" },
  menu: { component: Ionicons, name: "menu" },
  "person-circle-outline": {
    component: Ionicons,
    name: "person-circle-outline",
  },
  home: { component: Entypo, name: "home" },
  "credit-card": { component: Entypo, name: "credit-card" },
  archive: { component: Entypo, name: "archive" },
  "area-graph": { component: Entypo, name: "area-graph" },
};

interface IconProps {
  name: IconsName;
  size?: number;
  color?: string;
  style?: ViewStyle;
  variant?: "default" | "circularBackground" | "pillBackground";
  backgroundColor?: string;
}

const Icons: React.FC<IconProps> = ({
  name,
  size = 24,
  color = "black",
  style,
  variant = "default",
  backgroundColor = "transparent",
}) => {
  const iconDefinition = ICON_NAME_MAPPING[name];

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
              width: size * 2.4,
              height: size * 1.3,
              borderRadius: (size * 1.3) / 2,
              backgroundColor: backgroundColor,
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

export { Icons, IconsName };
