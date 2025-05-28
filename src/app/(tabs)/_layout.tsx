import { CustomBottomSheet } from "@/components/BottomSheet";
import FloatingActionButton from "@/components/FloatingActionButton";
import Header from "@/components/Header";
import { Icons } from "@/components/Icons";
import colors from "@/constants/colors";
import useProfile from "@/queries/useProfile";
import { Entypo } from "@expo/vector-icons";
import { Tabs, usePathname, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { Fragment, useEffect, useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { TextInput } from "react-native-gesture-handler";

interface TabProps {
  name: string;
  title: string;
  icon: keyof typeof Entypo.glyphMap;
}

export default function TabLayout() {
  const router = useRouter();
  const db = useSQLiteContext();
  const { profileData, saveProfile } = useProfile(db);
  const [profileName, setProfileName] = useState(profileData?.name || "");

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
  const handleProfileSubmit = async () => {
    await saveProfile(profileName, profileData?.currency || "GBP");
    setBottomSheetVisible(false);
  };

  const handleFabClick = () => {
    /* @TODO: navigate to add transaction/account/category*/
    switch (activeTabIndex) {
      case 0:
        router.push("/transaction/createTransaction");
        break;
      case 1:
        router.push("/account/createAccount");
        break;
      case 2:
        router.push("/category/createCategory");
        break;
      default:
        break;
    }
  };

  return (
    <Fragment>
      <Header
        title={tabs[activeTabIndex].title}
        onProfilePress={handleProfileTabPress}
      />
      <View
        style={{ flex: 1, position: "relative", backgroundColor: colors.bg }}
      >
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: colors.bg,
              borderColor: "#000",
            },
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
                  tabBarActiveTintColor: colors.textPrimary,
                  tabBarLabelStyle: {
                    fontSize: 14,
                  },
                  tabBarIconStyle: {
                    marginBottom: 4,
                  },
                  tabBarIcon: ({}) => (
                    <Icons
                      name={tab.icon}
                      size={28}
                      color={colors.accent}
                      variant={
                        activeTabIndex == index ? "pillBackground" : "default"
                      }
                      backgroundColor={
                        activeTabIndex == index
                          ? colors.accrentBg
                          : "transparent"
                      }
                    />
                  ),
                  sceneStyle: {
                    backgroundColor: colors.bg,
                  },
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
