import { Href, useRouter } from "expo-router";

import { FONT_SIZES, SPACINGS } from "@/constants/sizes";
import { useUserAccount } from "@/context/UserAccountContext";

import {
  Icons,
  IconsNameType,
  TouchableButton,
  Text,
} from "@/components/atoms";

export const MenuListItem = ({
  item,
  closeCustomSheet,
  active = false,
}: {
  item: {
    icon: IconsNameType;
    title: string;
    href: Href;
  };
  closeCustomSheet: () => void;
  active: boolean;
}) => {
  const { theme } = useUserAccount();
  const router = useRouter();

  return (
    <TouchableButton
      style={{
        display: "flex",
        flexDirection: "row",
        gap: SPACINGS.md,
        alignItems: "center",
        backgroundColor: active ? theme.tertiaryContainer : "",
        borderRadius: SPACINGS.xl,
        paddingHorizontal: SPACINGS.sm,
        paddingVertical: active ? SPACINGS.md : SPACINGS.sm,
      }}
      onPress={() => {
        closeCustomSheet();
        router.navigate(item.href);
      }}
    >
      <Icons
        name={item.icon}
        color={theme.onTertiaryContainer}
        size={FONT_SIZES.h5}
      />
      <Text color={theme.onTertiaryContainer}>{item.title}</Text>
    </TouchableButton>
  );
};
