import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";

import { useUserAccount } from "@/context/UserAccountContext";
import { FONT_SIZES, SPACINGS } from "@/constants";

import { CustomSheet, TouchableButton, Text } from "@/components/atoms";
import { InputField } from "@/components/molecules";

interface ProfileBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
}

export const ProfileSheet: React.FC<ProfileBottomSheetProps> = ({
  isVisible,
  onClose,
}) => {
  const { theme, userAccountData, setUserAccountData } = useUserAccount();
  const [profileName, setProfileName] = useState(userAccountData.name || "");

  useEffect(() => {
    if (userAccountData) {
      setProfileName(userAccountData.name);
    }
  }, [userAccountData]);

  const handleProfileSubmit = async () => {
    setUserAccountData({ ...userAccountData, name: profileName });
    onClose();
  };

  return (
    <CustomSheet isVisible={isVisible} onClose={onClose}>
      <View style={styles.container}>
        <Text
          size={FONT_SIZES.subheading}
          color={theme.onSurface}
          style={styles.label}
        >
          Profile
        </Text>
        <InputField
          value={profileName}
          placeholder={`Enter Profile Name`}
          onUpdate={setProfileName}
          style={{ borderColor: theme.onSurface }}
        />
        <TouchableButton variant="submit" onPress={handleProfileSubmit}>
          <Text color={theme.onPrimary} style={styles.buttonText}>
            Submit
          </Text>
        </TouchableButton>
      </View>
    </CustomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    gap: SPACINGS.md,
    marginTop: SPACINGS.md,
  },
  label: {
    fontWeight: "bold",
  },
  buttonText: {
    fontWeight: "bold",
  },
});
