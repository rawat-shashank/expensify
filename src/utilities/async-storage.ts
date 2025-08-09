import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeAsyncStorageData = async (key: string, value: any) => {
  console.log(key, value);

  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    throw "could not save your key or value";
  }
};

export const getAsyncStorageData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value != null ? JSON.parse(value) : null;
  } catch (e) {
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
