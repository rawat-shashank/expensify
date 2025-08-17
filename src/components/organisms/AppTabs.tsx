import { Tabs } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";

import { useUserAccount } from "@/context/UserAccountContext";
import { FONT_SIZES, SPACINGS, TAB_ITEMS } from "@/constants";
import { TabIcon } from "@/components";
import { TabProps } from "@/constants/tabItems";
import { useNavigationState } from "@react-navigation/native";

const tabs: TabProps[] = [...TAB_ITEMS];

export function AppTabs({
  onTabPress,
  activeTabIndex,
}: {
  onTabPress: (index: number) => void;
  activeTabIndex: number;
}) {
  const { theme } = useUserAccount();

  const navigationState = useNavigationState((state) => state);
  useEffect(() => {
    if (navigationState) {
      const rootState = navigationState;
      const rootRoute = rootState.routes[rootState.index];

      if (rootRoute?.state?.type === "tab") {
        const { routes, index = 0 } = rootRoute.state;
        const activeTabRoute = routes[index];

        const currentTabName = activeTabRoute.name;

        const tabIndex = tabs.findIndex((tab) => tab.name === currentTabName);
        onTabPress(tabIndex === -1 ? 0 : tabIndex);
      }
    }
  }, [navigationState, onTabPress]);

  return (
    <View style={styles.container}>
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
            const index = tabs.findIndex((tab) => tab.name === name);
            onTabPress(index === -1 ? 0 : index);
          },
        }}
      >
        {tabs.map((tab, index) => (
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
                <TabIcon tab={tab} isActive={activeTabIndex === index} />
              ),
            }}
          />
        ))}
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
});
