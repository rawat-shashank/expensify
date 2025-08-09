import { Href, useRouter } from "expo-router";

import { TouchableButton } from "./TouchableButtons";
import { FONT_SIZES, SPACINGS } from "@/constants/sizes";
import { Icons, IconsNameType } from "./Icons";
import { Text } from "./Text";
import { useUserAccount } from "@/context/UserAccountContext";

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
        gap: SPACINGS.xs,
        alignItems: "center",
        backgroundColor: active ? theme.tertiaryContainer : "",
        borderRadius: SPACINGS.lg,
        padding: SPACINGS.sm,
      }}
      onPress={() => {
        closeCustomSheet();
        router.push(item.href);
      }}
    >
      <Icons
        name={item.icon}
        color={theme.onTertiaryContainer}
        size={FONT_SIZES.subheading}
      />
      <Text color={theme.onTertiaryContainer}>{item.title}</Text>
    </TouchableButton>
  );
};
