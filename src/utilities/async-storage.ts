import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeAsyncStorageData = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("could not save your key or value", e);
  }
};

export const getAsyncStorageData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value != null ? JSON.parse(value) : null;
  } catch (e) {
    console.error("could not get your key or value", e);
    return null;
  }
};

export const clearAllAsyncStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log("AsyncStorage successfully cleared!");
  } catch (e) {
    console.error("Failed to clear AsyncStorage:", e);
  }
};
