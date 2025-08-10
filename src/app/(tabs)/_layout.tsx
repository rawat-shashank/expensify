import { Href, Tabs, usePathname, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import useProfile from "@/queries/useProfile";
import {
  Icons,
  InputField,
  TouchableButton,
  CustomSheet,
  IconsNameType,
  Text,
  FloatingActionButton,
  Header,
  MenuList,
} from "@/components";
import { FONT_SIZES } from "@/constants";
import { SPACINGS } from "@/constants/sizes";
import { useUserAccount } from "@/context/UserAccountContext";

interface TabProps {
  name: string;
  title: string;
  icon: IconsNameType;
  href: Href;
}

export default function TabLayout() {
  const { theme, userAccountData, setUserAccountData } = useUserAccount();
  const router = useRouter();
  const [profileName, setProfileName] = useState(userAccountData.name || "");
  useEffect(() => {
    if (userAccountData) {
      setProfileName(userAccountData.name);
    }
  }, [userAccountData]);

  const insets = useSafeAreaInsets();

  const tabs: TabProps[] = [
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
    {
      name: "overview",
      title: "Overview",
      icon: "area-graph",
      href: "/(tabs)/overview",
    },
  ];

  //checks the current path for current title on header
  const pathname = usePathname();

  const index = tabs.findIndex((tab) => tab.name == pathname.slice(1));
  const [activeTabIndex, setActiveIndex] = useState(index === -1 ? 0 : index);
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [isCustomSheetVisible, setCustomSheetVisible] = useState(false);

  useEffect(() => {
    const currentTabName = pathname?.slice(1);
    const index = tabs.findIndex((tab) => tab.name === currentTabName);
    setActiveIndex(index === -1 ? 0 : index);
  }, [pathname, tabs]);

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
    await setUserAccountData({ ...userAccountData, name: profileName });
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
            style={{ borderColor: theme.onSurface }}
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
              color={theme.primary}
              style={{
                fontWeight: "bold",
              }}
            >
              Expensify
            </Text>
          </View>
          <MenuList menuListItems={tabs} onPress={closeCustomSheet} />

          <View
            style={{
              borderBottomWidth: 1,
              borderColor: theme.surfaceDisabled,
              backgroundColor: "transparent",
              marginVertical: 4,
            }}
          />
          <TouchableButton
            style={{
              display: "flex",
              flexDirection: "row",
              gap: SPACINGS.xs,
              alignItems: "center",
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
              color={theme.onSecondaryContainer}
              size={FONT_SIZES.subheading}
            />
            <Text color={theme.onSecondaryContainer}>Settings</Text>
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
