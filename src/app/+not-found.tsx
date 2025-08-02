import { Stack, useRouter } from "expo-router";
import { Text, TouchableButton } from "@/components";

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <TouchableButton onPress={() => router.push("/(tabs)")}>
        <Text>Go to Home</Text>
      </TouchableButton>
    </>
  );
}
