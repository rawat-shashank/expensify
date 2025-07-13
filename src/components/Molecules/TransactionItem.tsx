import { StyleSheet, View } from "react-native";
import { Icons, IconsNameType } from "../atoms";
import { TouchableButton } from "../Atoms/TouchableButtons";
import { Text } from "../atoms/Text";

interface ListItemProps {
  item: {
    id: number;
    name: string;
    icon: IconsNameType;
    color: string;
  };
  onPress: (id: number) => void;
}

export const TransactionItem = ({ item, onPress }: ListItemProps) => {
  return (
    <TouchableButton onPress={() => onPress(item.id)} style={styles.list}>
      <Icons
        name={item.icon}
        variant="circularBackground"
        backgroundColor={item.color}
        size={20}
      />
      <View style={styles.card}>
        <Text>{item.name}</Text>
      </View>
    </TouchableButton>
  );
};

const styles = StyleSheet.create({
  list: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  card: {
    paddingVertical: 16,
    flex: 1,
  },
});
