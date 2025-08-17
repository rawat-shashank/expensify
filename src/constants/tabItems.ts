import { Href } from "expo-router";
import { IconsNameType } from "@/components";

export interface TabProps {
  name: string;
  title: string;
  icon: IconsNameType;
  href: Href;
}

export const TAB_ITEMS: TabProps[] = [
  { name: "index", title: "Home", icon: "home", href: "/(tabs)" },
  {
    name: "account",
    title: "Account",
    icon: "credit-card",
    href: "/(tabs)/account",
  },
  {
    name: "category",
    title: "Category",
    icon: "archive",
    href: "/(tabs)/category",
  },
  // {
  //   name: "overview",
  //   title: "Overview",
  //   icon: "area-graph",
  //   href: "/(tabs)/overview",
  // },
];
