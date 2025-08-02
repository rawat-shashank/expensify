import { ScrollView, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import { AccountCardTypeEnum, AccountType } from "@/database/accountsSchema";
import { useTheme } from "@/context/ThemeContext";
import { Icons, IconsNameType, TouchableButton, Text } from "../atoms";
import { FONT_SIZES, SPACINGS } from "@/constants/sizes";

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
  const router = useRouter();

  return (
    <View>
      <Text
        color={theme.tertiary}
        style={{
          marginBottom: SPACINGS.md,
          fontWeight: "bold",
        }}
      >
        Select account
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.accountListContentContainer}
      >
        <TouchableButton
          onPress={() => {
            router.push("/(screens)/account/createAccount");
          }}
          style={[
            styles.accountCardBase,
            {
              borderRadius: SPACINGS.md,
              borderColor: theme.secondaryContainer,
              backgroundColor: theme.background,
              borderBottomWidth: 2,
              borderWidth: 1,
            },
          ]}
        >
          <Icons
            variant="circularBackground"
            name="plus"
            color={theme.onSecondaryContainer}
            backgroundColor={theme.secondaryContainer}
          />
          <Text color={theme.onSurface}>Add New</Text>
        </TouchableButton>

        {accounts.map((item) => {
          let iconName: IconsNameType;
          switch (item.cardType) {
            case AccountCardTypeEnum.BANK:
              iconName = "bank";
              break;
            case AccountCardTypeEnum.WALLET:
              iconName = "wallet-outline";
              break;
            case AccountCardTypeEnum.CASH:
              iconName = "cash-outline";
              break;
            default:
              iconName = "help-circle-outline";
          }

          return (
            <TouchableButton
              key={item.id.toString()}
              onPress={() => onSelect(item.id)}
              style={[
                styles.accountCardBase,
                {
                  backgroundColor:
                    activeAccountId === item.id
                      ? theme.secondaryContainer
                      : "transparent",
                  borderColor:
                    activeAccountId === item.id
                      ? theme.onSecondaryContainer
                      : theme.secondaryContainer,
                  borderLeftWidth: activeAccountId === item.id ? 2 : 1,
                  borderRightWidth: activeAccountId === item.id ? 2 : 1,
                  borderBottomWidth: 2,
                  borderTopWidth: activeAccountId === item.id ? 2 : 1,
                  borderRadius: SPACINGS.md,
                },
              ]}
            >
              <View>
                <Icons
                  variant="circularBackground"
                  name={iconName}
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
              </View>
              <View>
                <Text color={theme.onSurface}>{item.name}</Text>
                <Text size={FONT_SIZES.caption} color={theme.onSurface}>
                  {item.accountName}
                </Text>
              </View>
            </TouchableButton>
          );
        })}
      </ScrollView>

      {error && <Text color={theme.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  accountListContentContainer: {
    flexDirection: "row",
    gap: SPACINGS.xs,
  },
  accountCardBase: {
    width: 128,
    minHeight: 144,
    padding: SPACINGS.md,
    display: "flex",
    justifyContent: "space-between",
    gap: SPACINGS.xl,
  },
});
