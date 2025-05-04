import { CustomBottomSheet } from "@/components/bottomSheet";
import Header from "@/components/header";
import { Entypo } from "@expo/vector-icons";
import { Tabs, usePathname } from "expo-router";
import { Fragment, useState } from "react";
import { SafeAreaView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface TabProps {
  name: string;
  title: string;
  icon: keyof typeof Entypo.glyphMap;
}

export default function TabLayout() {
  const tabs: TabProps[] = [
    { name: "home", title: "Home", icon: "home" },
    { name: "account", title: "Account", icon: "credit-card" },
    { name: "category", title: "Category", icon: "archive" },
    { name: "overview", title: "Overview", icon: "area-graph" },
  ];

  //checks the current path for current title on header
  const pathname = usePathname();
  const index = tabs.findIndex((tab) => tab.name == pathname.slice(1));
  const [activeTabIndex, setActiveIndex] = useState(index === -1 ? 0 : index);
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);

  const handleProfileTabPress = () => {
    setBottomSheetVisible(true);
  };
  const closeBottomSheet = () => {
    setBottomSheetVisible(false);
  };
  const insets = useSafeAreaInsets();

  return (
    //<View style={{ flex: 1, paddingTop: insets.top }}>
    <Fragment>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#f8f8f8", paddingTop: insets.top }}
      >
        <Header
          title={tabs[activeTabIndex].title}
          onProfilePress={handleProfileTabPress}
        />
        <Tabs
          screenOptions={{
            headerShown: false,
          }}
          screenListeners={{
            tabPress: (e) => {
              const name = e.target?.split("-")[0];
              const index = tabs.findIndex((tab) => tab.name == name);
              //set current active index for header title update
              setActiveIndex(index === -1 ? 0 : index);
            },
          }}
        >
          {tabs.map((tab) => {
            return (
              <Tabs.Screen
                key={tab.name}
                name={tab.name}
                options={{
                  title: tab.title,
                  tabBarIcon: ({}) => (
                    <Entypo name={tab.icon} size={28} color="#000" />
                  ),
                }}
              />
            );
          })}
        </Tabs>
        <CustomBottomSheet
          isVisible={isBottomSheetVisible}
          onClose={closeBottomSheet}
          label="Profile"
        />
      </SafeAreaView>
    </Fragment>
    //</View>
  );
}
