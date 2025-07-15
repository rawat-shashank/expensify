import { Stack } from "expo-router";
import { View } from "react-native";
import { Text } from "@/components";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View>
        <Text>Go to Home</Text>
      </View>
    </>
  );
}
