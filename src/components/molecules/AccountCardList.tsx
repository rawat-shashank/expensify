import { FlatList, View } from "react-native";
import { useRouter } from "expo-router";

import { AccountCardTypeEnum, AccountType } from "@/database/accountsSchema";
import { useTheme } from "@/context/ThemeContext";
import { Icons, TouchableButton, Text } from "../atoms";

interface AccountCardProps {
  accounts: AccountType[];
  activeAccountId: number;
  onSelect: (id: number) => void;
  error?: string;
}
export const AccountCardList = ({
  accounts,
  activeAccountId,
  onSelect,
  error,
}: AccountCardProps) => {
  const { theme } = useTheme();
  const ItemSeparatorComponent = () => (
    <View style={{ width: 8, backgroundColor: "transparent" }} />
  );
  const router = useRouter();
  return (
    <View>
      <Text
        color={theme.tertiary}
        style={{
          marginBottom: 16,
          fontWeight: "bold",
        }}
      >
        Select account
      </Text>
      <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
        <TouchableButton
          onPress={() => {
            router.push("/(screens)/account/createAccount");
          }}
          style={{
            borderRadius: 16,
            borderColor: theme.secondaryContainer,
            backgroundColor: theme.background,
            width: 128,
            padding: 16,
            minHeight: 144,
            display: "flex",
            justifyContent: "space-between",
            borderBottomWidth: 2,
            borderWidth: 1,
          }}
        >
          <Icons
            variant="circularBackground"
            name="plus"
            color={theme.onSecondaryContainer}
            backgroundColor={theme.secondaryContainer}
          />
          <Text color={theme.onSurface}>Add New</Text>
        </TouchableButton>
        <FlatList
          ItemSeparatorComponent={ItemSeparatorComponent}
          data={accounts}
          keyExtractor={(item) => item.id.toString()}
          extraData={activeAccountId}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          renderItem={({ item }) => {
            return (
              <TouchableButton
                onPress={() => onSelect(item.id)}
                style={{
                  borderRadius: 16,
                  backgroundColor:
                    activeAccountId === item.id
                      ? theme.secondaryContainer
                      : "transparent",
                  borderColor:
                    activeAccountId === item.id
                      ? theme.onSecondaryContainer
                      : theme.secondaryContainer,
                  width: 128,
                  padding: 16,
                  minHeight: 144,
                  display: "flex",
                  justifyContent: "space-between",
                  borderLeftWidth: activeAccountId == item.id ? 2 : 1,
                  borderRightWidth: activeAccountId == item.id ? 2 : 1,
                  borderBottomWidth: 2,
                  borderTopWidth: activeAccountId == item.id ? 2 : 1,
                  gap: 32,
                }}
              >
                <View>
                  {item.cardType === AccountCardTypeEnum.BANK && (
                    <Icons
                      variant="circularBackground"
                      name="bank"
                      color={theme.onBackground}
                      backgroundColor={theme.background}
                    />
                  )}
                  {item.cardType === AccountCardTypeEnum.WALLET && (
                    <Icons
                      variant="circularBackground"
                      name="wallet-outline"
                      color={theme.onBackground}
                      backgroundColor={theme.background}
                    />
                  )}
                  {item.cardType === AccountCardTypeEnum.CASH && (
                    <Icons
                      name="cash-outline"
                      variant="circularBackground"
                      color={
                        activeAccountId === item.id
                          ? theme.onBackground
                          : theme.onSecondaryContainer
                      }
                      backgroundColor={
                        activeAccountId === item.id
                          ? theme.background
                          : theme.secondaryContainer
                      }
                    />
                  )}
                </View>
                <View>
                  <Text color={theme.onSurface}>{item.name}</Text>
                  <Text size={12} color={theme.onSurface}>
                    {item.accountName}
                  </Text>
                </View>
              </TouchableButton>
            );
          }}
        />
      </View>
      {error && <Text color={theme.error}>{error}</Text>}
    </View>
  );
};
