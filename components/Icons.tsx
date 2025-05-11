import React from "react";
import { Entypo } from "@expo/vector-icons";
import { TextStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes";

type IconsName = keyof typeof Entypo.glyphMap;

type IconMappingValue = {
  component: React.ComponentType<any>;
  name: IconsName;
};
const ICON_NAME_MAPPING: { [key: string]: IconMappingValue } = {
  plus: { component: Entypo, name: "plus" },
};

interface IconProps {
  name: IconsName;
  size?: number;
  color?: string;
  style?: TextStyle;
}

const Icons: React.FC<IconProps> = ({
  name,
  size = 24,
  color = "black",
  style,
}) => {
  const iconDefinition = ICON_NAME_MAPPING[name];

  if (!iconDefinition) {
    console.warn(`Icon "${name}" not found in ICON_NAME_MAPPING`);
    return null;
  }

  const { component: IconComponent, name: iconName } = iconDefinition;

  return (
    <IconComponent name={iconName} size={size} color={color} style={style} />
  );
};

export { Icons, IconsName };
