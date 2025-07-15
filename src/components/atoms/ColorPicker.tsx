import { View, TouchableOpacity, StyleSheet } from "react-native";
import { ColorDotWithRing } from "../atoms";

export const ColorPicker = ({
  onSelect,
}: {
  color?: string;
  onSelect: (color: string) => void;
}) => {
  const setSelectedColor = (color: string) => {
    onSelect(color);
  };

  const generateColors = (hueStart: number, hueEnd: number, count: number) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const hue = hueStart + (i / (count - 1)) * (hueEnd - hueStart);
      // Using HSL for easier calculation of equidistant colors
      // We'll keep saturation and lightness constant for simplicity, varying only hue
      // In CSS HSL: hue is degrees (0-360), saturation and lightness are percentages (0-100)
      const color = `hsl(${hue}, 100%, 50%)`; // Full saturation, 50% lightness
      colors.push(color);
    }
    return colors;
  };

  // Red spectrum (0-60 degrees in HSL, roughly)
  const redColors = generateColors(0, 60, 6);
  // Green spectrum (60-180 degrees in HSL, roughly)
  const greenColors = generateColors(70, 180, 6);
  // Blue spectrum (180-240 degrees in HSL, roughly)
  const blueColors = generateColors(190, 240, 6);

  return (
    <View
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={styles.row}>
        {redColors.map((color, index) => (
          <TouchableOpacity
            key={`red-${index}`}
            style={styles.colorBox}
            onPress={() => setSelectedColor(color)}
          >
            <ColorDotWithRing color={color} size={32} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.row}>
        {greenColors.map((color, index) => (
          <TouchableOpacity
            key={`green-${index}`}
            style={styles.colorBox}
            onPress={() => setSelectedColor(color)}
          >
            <ColorDotWithRing color={color} size={32} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.row}>
        {blueColors.map((color, index) => (
          <TouchableOpacity
            key={`blue-${index}`}
            style={styles.colorBox}
            onPress={() => setSelectedColor(color)}
          >
            <ColorDotWithRing color={color} size={32} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  selectedColorPreview: {
    width: "80%",
    height: 50,
    borderRadius: 8,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  selectedColorText: {
    color: "#000", // Adjust text color based on background for readability
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
  row: {
    flexDirection: "row",
    marginBottom: 16,
  },
  colorBox: {
    width: 30,
    height: 30,
    marginHorizontal: 16,
  },
});
