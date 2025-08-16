import { Href, useSegments } from "expo-router";
import { FlatList } from "react-native";

import { IconsNameType } from "@/components/atoms";
import { MenuListItem } from "@/components/molecules";

export const MenuList = ({
  menuListItems,
  onPress,
}: {
  menuListItems: {
    icon: IconsNameType;
    title: string;
    name: string;
    href: Href;
  }[];
  onPress: () => void;
}) => {
  const segments = useSegments();

  return (
    <FlatList
      data={menuListItems}
      renderItem={({ item }) => (
        <MenuListItem
          active={item.href.toString().endsWith(segments[segments.length - 1])}
          item={item}
          closeCustomSheet={onPress}
        />
      )}
    />
  );
};
