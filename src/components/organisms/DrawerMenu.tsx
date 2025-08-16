import React from "react";
import { useRouter } from "expo-router";
import { View, StyleSheet } from "react-native";

import { useUserAccount } from "@/context/UserAccountContext";
import { FONT_SIZES, SPACINGS } from "@/constants";
import { TAB_ITEMS } from "@/constants/tabItems";

import { CustomSheet, Icons, Text, TouchableButton } from "@/components/atoms";
import { MenuList } from "./MenuList";

interface DrawerMenuProps {
  isVisible: boolean;
  onClose: () => void;
}

export const DrawerMenu: React.FC<DrawerMenuProps> = ({
  isVisible,
  onClose,
}) => {
  const { theme } = useUserAccount();
  const router = useRouter();

  const handleSettingsPress = () => {
    onClose();
    router.navigate("/settings");
  };

  return (
    <CustomSheet isVisible={isVisible} onClose={onClose} direction="left">
      <View style={styles.header}>
        <Icons
          size={FONT_SIZES.h3}
          name="wallet-outline"
          color={theme.primary}
        />
        <Text size={FONT_SIZES.h5} color={theme.primary} style={styles.title}>
          Expensify
        </Text>
      </View>
      <View>
        <MenuList menuListItems={TAB_ITEMS} onPress={onClose} />
        <View
          style={[
            styles.divider,
            {
              borderColor: theme.onSurfaceDisabled,
            },
          ]}
        />
        <TouchableButton
          style={styles.settingsButton}
          onPress={handleSettingsPress}
        >
          <Icons
            name="settings"
            color={theme.onSecondaryContainer}
            size={FONT_SIZES.subheading}
          />
          <Text color={theme.onSecondaryContainer}>Settings</Text>
        </TouchableButton>
      </View>
    </CustomSheet>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    gap: SPACINGS.md,
    alignItems: "center",
    marginHorizontal: SPACINGS.xs,
    marginVertical: SPACINGS.md,
  },
  title: {
    fontWeight: "bold",
  },
  divider: {
    borderBottomWidth: 1,
    marginVertical: SPACINGS.tiny,
    marginHorizontal: SPACINGS.sm,
  },
  settingsButton: {
    flexDirection: "row",
    gap: SPACINGS.xs,
    alignItems: "center",
    borderRadius: SPACINGS.lg,
    padding: SPACINGS.sm,
  },
});
