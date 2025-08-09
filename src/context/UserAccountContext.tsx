import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { Material3Scheme } from "@pchmn/expo-material3-theme";

import { useAppTheme } from "@/hooks/useMaterial3Theme";
import {
  getAsyncStorageData,
  storeAsyncStorageData,
} from "@/utilities/async-storage";
import { defaultTheme } from "@/constants/colors";
import { ActivityIndicator } from "react-native";
import {
  ASYNC_STORAGE_KEYS,
  DEFAULT_USER_DATA,
  UserAccountData,
} from "@/constants/async-storage-keys";

interface UserAccountContextType {
  userAccountData: UserAccountData;
  setUserAccountData: (userAccountData: UserAccountData) => void;
  theme: Material3Scheme;
  colorScheme: "dark" | "light";
  isMaterialYou: boolean;
  setIsMaterialYou: (value: boolean) => void;
}

const UserAccountContext = createContext<UserAccountContextType | null>(null);

interface UserAccountProviderProps {
  children: ReactNode;
}

export function UserAccountProvider({ children }: UserAccountProviderProps) {
  const { currentTheme, colorScheme } = useAppTheme();

  const [userAccountData, setUserAccountData] = useState<UserAccountData>({});
  const [isLoading, setIsLoading] = useState(true);

  const toggleMaterialYou = async (value: boolean) => {
    setUserAccountData({
      ...userAccountData,
      materialYou: value,
    });
    await storeAsyncStorageData(ASYNC_STORAGE_KEYS.USER_ACCOUNT, {
      ...userAccountData,
      materialYou: value,
    });
  };

  useEffect(() => {
    const getStoredUserAccount = async () => {
      try {
        const userStoredAccount = await getAsyncStorageData(
          ASYNC_STORAGE_KEYS.USER_ACCOUNT,
        );
        console.log(userStoredAccount);

        if (userAccountData) {
          setUserAccountData(userStoredAccount);
        } else {
          setUserAccountData(DEFAULT_USER_DATA);
        }
      } catch (e) {
        setUserAccountData(DEFAULT_USER_DATA);
      } finally {
        setIsLoading(false);
      }
    };

    getStoredUserAccount();
  }, []);

  if (isLoading || !userAccountData) {
    <ActivityIndicator size="large" />;
  }

  return (
    <UserAccountContext.Provider
      value={{
        userAccountData,
        setUserAccountData,
        theme: userAccountData.materialYou
          ? currentTheme[colorScheme]
          : defaultTheme[colorScheme],
        colorScheme,
        isMaterialYou: userAccountData.materialYou,
        setIsMaterialYou: toggleMaterialYou,
      }}
    >
      {children}
    </UserAccountContext.Provider>
  );
}

export function useUserAccount(): UserAccountContextType {
  const context = useContext(UserAccountContext);
  if (!context) {
    throw new Error("useUserAccount must be used within a UserAccountProvider");
  }
  return context;
}
