import { FlatList, Text, View } from "react-native";
import { TextLabel } from "../Atoms/TextLabel";
import { TouchableButton } from "../Atoms/TouchableButtons";
import { useRouter } from "expo-router";
import { materialTheme } from "@/constants";
import { AccountCardTypeEnum, AccountType } from "@/database/accountsSchema";
import { Icons } from "../Atoms/Icons";

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
  const ItemSeparatorComponent = () => (
    <View style={{ width: 8, backgroundColor: "transparent" }} />
  );
  const router = useRouter();
  return (
    <View>
      <TextLabel label="Select account" />
      <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
        <TouchableButton
          onPress={() => {
            router.push("/(screens)/account/createAccount");
          }}
          style={{
            borderRadius: 16,
            borderColor: materialTheme.onSurfaceDisabled,
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
            backgroundColor={materialTheme.tertiary}
          />
          <Text>Add New</Text>
        </TouchableButton>
        <FlatList
          ItemSeparatorComponent={ItemSeparatorComponent}
          data={accounts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableButton
              onPress={() => onSelect(item.id)}
              style={{
                borderRadius: 16,
                borderColor:
                  activeAccountId === item.id
                    ? materialTheme.onSurface
                    : materialTheme.onSurfaceDisabled,
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
                    backgroundColor={materialTheme.tertiary}
                  />
                )}
                {item.cardType === AccountCardTypeEnum.WALLET && (
                  <Icons
                    variant="circularBackground"
                    name="wallet-outline"
                    backgroundColor={materialTheme.tertiary}
                  />
                )}
                {item.cardType === AccountCardTypeEnum.CASH && (
                  <Icons
                    name="cash-outline"
                    variant="circularBackground"
                    backgroundColor={materialTheme.tertiary}
                  />
                )}
              </View>
              <View>
                <Text style={{ fontSize: 16 }}>{item.name}</Text>
                <Text style={{ fontSize: 12 }}>{item.accountName}</Text>
              </View>
            </TouchableButton>
          )}
          extraData={activeAccountId}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
        />
      </View>
      {error && (
        <Text
          style={{
            color: materialTheme.error,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
};
