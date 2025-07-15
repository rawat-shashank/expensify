import { StyleSheet, View, SafeAreaView } from "react-native";
import { BlurView } from "expo-blur";
import { useTheme } from "@/context/ThemeContext";
import { Text } from "../atoms";

export default function App() {
  const { theme } = useTheme();
  const text = "Hello, my container is blurring contents underneath!";

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={[
          styles.background,
          {
            backgroundColor: theme.primary,
            margin: 32,
            borderRadius: 16,
          },
        ]}
      />
      <BlurView
        intensity={100}
        tint="dark"
        style={[
          styles.blurContainer,
          {
            borderColor: theme.onBackground,
            borderWidth: 1,
          },
        ]}
      >
        <Text style={styles.text}>{text}</Text>
      </BlurView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  blurContainer: {
    flex: 1,
    padding: 20,
    margin: 16,
    textAlign: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: 16,
  },
  background: {
    flex: 1,
    flexWrap: "wrap",
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  box: {
    width: "25%",
    height: "20%",
  },
  boxEven: {
    backgroundColor: "orangered",
  },
  boxOdd: {
    backgroundColor: "gold",
  },
  text: {
    fontSize: 24,
    fontWeight: "600",
  },
});
