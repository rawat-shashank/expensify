import useProfile from "@/queries/useProfile";

import { Tabs, usePathname, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import {
  Icons,
  InputField,
  TouchableButton,
  CustomSheet,
  IconsNameType,
  Text,
  FloatingActionButton,
  Header,
} from "@/components";
import { FONT_SIZES } from "@/constants";
import { SPACINGS } from "@/constants/sizes";

interface TabProps {
  name: string;
  title: string;
  icon: IconsNameType;
}

export default function TabLayout() {
  const { theme } = useTheme();
  const router = useRouter();
  const db = useSQLiteContext();
  const { profileData, saveProfile } = useProfile(db);
  const [profileName, setProfileName] = useState(profileData?.name || "");

  const insets = useSafeAreaInsets();

  const tabs: TabProps[] = [
    { name: "index", title: "Home", icon: "home" },
    { name: "account", title: "Account", icon: "credit-card" },
    { name: "category", title: "Category", icon: "archive" },
    { name: "overview", title: "Overview", icon: "area-graph" },
  ];

  //checks the current path for current title on header
  const pathname = usePathname();
  const index = tabs.findIndex((tab) => tab.name == pathname.slice(1));
  const [activeTabIndex, setActiveIndex] = useState(index === -1 ? 0 : index);
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [isCustomSheetVisible, setCustomSheetVisible] = useState(false);

  useEffect(() => {
    if (profileData) {
      setProfileName(profileData.name);
    }
  }, [profileData]);

  const handleProfileTabPress = () => {
    setBottomSheetVisible(true);
  };

  const handleMenuPress = () => {
    setCustomSheetVisible(true);
  };

  const closeBottomSheet = () => {
    setBottomSheetVisible(false);
  };

  const closeCustomSheet = () => {
    setCustomSheetVisible(false);
  };

  const handleProfileSubmit = async () => {
    await saveProfile(profileName, profileData?.currency || "GBP");
    setBottomSheetVisible(false);
  };

  const handleFabClick = () => {
    switch (activeTabIndex) {
      case 0:
        router.push("/transaction/createTransaction");
        break;
      case 1:
        router.push("/(screens)/account/createAccount");
        break;
      case 2:
        router.push("/(screens)/category/createCategory");
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <Header
        title={tabs[activeTabIndex].title}
        leftIcon="menu"
        onLeftIconPress={handleMenuPress}
        rightIcon="person-circle-outline"
        onRightIconPress={handleProfileTabPress}
      />
      <View
        style={{
          flex: 1,
          position: "relative",
        }}
      >
        <Tabs
          screenOptions={{
            sceneStyle: {
              backgroundColor: theme.background,
            },
            headerShown: false,
          }}
          screenListeners={{
            tabPress: (e) => {
              const name = e.target?.split("-")[0];
              const index = tabs.findIndex((tab) => tab.name == name);
              setActiveIndex(index === -1 ? 0 : index);
            },
          }}
        >
          {tabs.map((tab, index) => {
            return (
              <Tabs.Screen
                key={tab.name}
                name={tab.name}
                options={{
                  title: tab.title,
                  tabBarActiveTintColor: theme.onSurface,
                  tabBarInactiveTintColor: theme.onSurfaceVariant,
                  tabBarStyle: {
                    backgroundColor: theme.background,
                    elevation: 0,
                  },
                  tabBarLabelStyle: {
                    fontSize: FONT_SIZES.small,
                  },
                  tabBarIconStyle: {
                    marginVertical: SPACINGS.xs,
                  },
                  tabBarIcon: ({}) => (
                    <Icons
                      name={tab.icon}
                      size={FONT_SIZES.h4}
                      color={
                        activeTabIndex === index
                          ? theme.onSurface
                          : theme.onSurfaceVariant
                      }
                      variant={
                        activeTabIndex === index ? "pillBackground" : "default"
                      }
                      backgroundColor={
                        activeTabIndex == index
                          ? theme.tertiaryContainer
                          : "transparent"
                      }
                    />
                  ),
                }}
              />
            );
          })}
        </Tabs>
        <View style={styles.fabContainer}>
          <FloatingActionButton onPress={handleFabClick} />
        </View>
      </View>
      <CustomSheet isVisible={isBottomSheetVisible} onClose={closeBottomSheet}>
        <View
          style={{
            display: "flex",
            gap: SPACINGS.md,
            marginTop: SPACINGS.md,
          }}
        >
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
          />
          <TouchableButton variant="submit" onPress={handleProfileSubmit}>
            <Text color={theme.onPrimary} style={{ fontWeight: "bold" }}>
              Submit
            </Text>
          </TouchableButton>
        </View>
      </CustomSheet>
      <CustomSheet
        isVisible={isCustomSheetVisible}
        onClose={closeCustomSheet}
        direction="left"
      >
        <View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: SPACINGS.md,
              alignItems: "center",
              margin: SPACINGS.xs,
            }}
          >
            <Icons
              size={FONT_SIZES.h4}
              name="wallet-outline"
              color={theme.primary}
            />
            <Text
              size={FONT_SIZES.h5}
              style={{
                color: theme.primary,
                fontWeight: "bold",
              }}
            >
              Expensify
            </Text>
          </View>

          <TouchableButton
            style={{
              display: "flex",
              flexDirection: "row",
              gap: SPACINGS.xs,
              marginVertical: SPACINGS.xs,
              alignItems: "center",
              backgroundColor: theme.secondaryContainer,
              borderRadius: SPACINGS.lg,
              padding: SPACINGS.sm,
            }}
            onPress={() => {
              closeCustomSheet();
              router.push("/settings");
            }}
          >
            <Icons
              name="settings"
              color={theme.primary}
              size={FONT_SIZES.subheading}
            />
            <Text
              style={{
                color: theme.onSecondaryContainer,
              }}
            >
              Settings
            </Text>
          </TouchableButton>
        </View>
      </CustomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  label: {
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderRadius: SPACINGS.sm,
    padding: SPACINGS.sm,
    marginBottom: SPACINGS.md,
  },
  fabContainer: {
    position: "absolute",
    right: SPACINGS.lg,
    bottom: 90,
  },
});
