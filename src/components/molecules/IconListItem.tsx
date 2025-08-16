import { StyleSheet } from "react-native";
import { ReactNode } from "react";

import { FONT_SIZES } from "@/constants";
import { SPACINGS } from "@/constants/sizes";

import { Icons, IconsNameType, TouchableButton } from "@/components/atoms";

interface IconListItemProps {
  icon: IconsNameType;
  color: string;
  children: ReactNode;
  onPress: () => void;
}

export const IconListItem = ({
  icon,
  color,
  children,
  onPress,
}: IconListItemProps) => {
  return (
    <TouchableButton onPress={onPress} style={styles.list}>
      <Icons
        name={icon}
        variant="circularBackground"
        backgroundColor={color}
        size={FONT_SIZES.h4}
      />
      {children}
    </TouchableButton>
  );
};

const styles = StyleSheet.create({
  list: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: SPACINGS.md,
  },
});
