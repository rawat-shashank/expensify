import { CustomBottomSheet } from "@/components/BottomSheet";
import FloatingActionButton from "@/components/FloatingActionButton";
import Header from "@/components/Header";
import useProfile from "@/hooks/useProfile";
import { Entypo } from "@expo/vector-icons";
import { Tabs, usePathname, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { Fragment, useEffect, useState } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface TabProps {
  name: string;
  title: string;
  icon: keyof typeof Entypo.glyphMap;
}

export default function TabLayout() {
  const router = useRouter();
  const db = useSQLiteContext();
  const { profileData, saveProfile } = useProfile(db);
  const [profileName, setProfileName] = useState("");

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

  useEffect(() => {
    if (profileData) {
      setProfileName(profileData.name);
    }
  }, [profileData]);

  const handleProfileTabPress = () => {
    setBottomSheetVisible(true);
  };

  const closeBottomSheet = () => {
    setBottomSheetVisible(false);
  };
  const handleProfileSubmit = () => {
    saveProfile(profileName, profileData?.currency || "GBP");
    setBottomSheetVisible(false);
  };

  const handleFabClick = () => {
    /* @TODO: navigate to add transaction/account/category*/
    if (activeTabIndex == 1) {
      router.push("/account/createAccount");
    }
    if (activeTabIndex == 2) {
      router.push("/category/createCategory");
    }
  };
  const insets = useSafeAreaInsets();

  return (
    //<View style={{ flex: 1, paddingTop: insets.top }}>
    <Fragment>
      <SafeAreaView
        // @TODO: update backgroundColor with primary color
        style={{ flex: 1, backgroundColor: "#f8f8f8", paddingTop: insets.top }}
      >
        <Header
          title={tabs[activeTabIndex].title}
          onProfilePress={handleProfileTabPress}
        />
        <View style={{ flex: 1, position: "relative" }}>
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
          <View style={styles.fabContainer}>
            <FloatingActionButton onPress={handleFabClick} />
          </View>
        </View>
        <CustomBottomSheet
          isVisible={isBottomSheetVisible}
          onClose={closeBottomSheet}
        >
          <View>
            {<Text style={styles.label}>Profile</Text>}
            <>
              <TextInput
                value={profileName}
                style={styles.input}
                placeholder={`Enter Profile Name`}
                onChangeText={setProfileName}
              />
              <TouchableOpacity
                onPress={handleProfileSubmit}
                style={styles.closeButton}
              >
                <Text>Submit</Text>
              </TouchableOpacity>
            </>
          </View>
        </CustomBottomSheet>
      </SafeAreaView>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  closeButton: {
    padding: 10,
    alignItems: "center",
    backgroundColor: "#eee",
    borderRadius: 5,
  },
  fabContainer: {
    position: "absolute",
    right: 20,
    bottom: 90,
  },
});
