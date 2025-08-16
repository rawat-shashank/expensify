import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  FloatingActionButton,
  Header,
  DrawerMenu,
  ProfileSheet,
} from "@/components";
import { SPACINGS } from "@/constants/sizes";
import { AppTabs } from "@/components/organisms/AppTabs";
import { TAB_ITEMS } from "@/constants";

export default function TabLayout() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [activeTabIndex, setActiveIndex] = useState(0);
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [isDrawerMenuSheetVisible, setDrawerMenuSheetVisible] = useState(false);

  const handleProfileTabPress = () => {
    setBottomSheetVisible(true);
  };

  const handleMenuPress = () => {
    setDrawerMenuSheetVisible(true);
  };

  const closeCustomSheet = () => {
    setDrawerMenuSheetVisible(false);
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

  const onTabPress = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <Header
        title={activeTabIndex ? TAB_ITEMS[activeTabIndex].title : "Home"}
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
        <AppTabs onTabPress={onTabPress} activeTabIndex={activeTabIndex} />

        <View style={styles.fabContainer}>
          <FloatingActionButton onPress={handleFabClick} />
        </View>
      </View>
      <ProfileSheet
        isVisible={isBottomSheetVisible}
        onClose={closeCustomSheet}
      />
      <DrawerMenu
        isVisible={isDrawerMenuSheetVisible}
        onClose={closeCustomSheet}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fabContainer: {
    position: "absolute",
    right: SPACINGS.lg,
    bottom: 90,
  },
});
