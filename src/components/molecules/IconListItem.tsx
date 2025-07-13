import { StyleSheet } from "react-native";
import { Icons, IconsNameType } from "../atoms";
import { TouchableButton } from "../atoms";
import { ReactNode } from "react";

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
        size={20}
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
    gap: 16,
  },
});
