import React from "react";
import { Href } from "expo-router";

import { Icons, IconsNameType } from "@/components/atoms";
import { FONT_SIZES } from "@/constants";
import { useUserAccount } from "@/context/UserAccountContext";

interface TabProps {
  name: string;
  title: string;
  icon: IconsNameType;
  href: Href;
}

interface TabIconProps {
  tab: TabProps;
  isActive: boolean;
}

export const TabIcon: React.FC<TabIconProps> = ({ tab, isActive }) => {
  const { theme } = useUserAccount();

  return (
    <Icons
      name={tab.icon}
      size={FONT_SIZES.h4}
      color={isActive ? theme.onSurface : theme.onSurfaceVariant}
      variant={isActive ? "pillBackground" : "default"}
      backgroundColor={isActive ? theme.tertiaryContainer : "transparent"}
    />
  );
};
