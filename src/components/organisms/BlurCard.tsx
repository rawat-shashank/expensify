import React, { ReactNode, useState } from "react";
import { StyleSheet, View } from "react-native";
import { BlurView } from "expo-blur";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
import { SPACINGS } from "@/constants";

const BLOB_PATHS = [
  "M19.5,-21.2C25.4,-18.3,30.4,-12.3,30.7,-6.1C31,0.1,26.7,6.5,22.1,11.3C17.6,16,12.9,19.2,7.8,20.6C2.8,22,-2.5,21.7,-7,19.8C-11.5,17.9,-15.2,14.4,-17.8,10.2C-20.3,5.9,-21.7,0.9,-22,-5C-22.3,-11,-21.6,-17.9,-17.8,-21.1C-13.9,-24.3,-7,-23.8,-0.1,-23.7C6.8,-23.6,13.6,-24,19.5,-21.2Z",
  "M18.4,-26.2C22,-18.9,21.9,-11.4,21.9,-4.9C21.8,1.6,21.8,7.1,20.1,13.1C18.4,19,15,25.5,9.1,29.5C3.3,33.6,-5.1,35.3,-12.4,33.1C-19.7,30.9,-26,24.7,-29.8,17.5C-33.7,10.3,-35.1,1.9,-32.6,-4.6C-30.1,-11.2,-23.8,-16,-17.7,-22.9C-11.6,-29.9,-5.8,-39,0.8,-39.9C7.4,-40.8,14.7,-33.6,18.4,-26.2Z",
  "M17.4,-20.9C22.2,-14.9,25.7,-7.4,25.8,0.1C25.9,7.6,22.5,15.2,16.8,19.8C11,24.4,2.9,26,-5,25.2C-12.8,24.4,-20.5,21.2,-23.9,15.8C-27.2,10.4,-26.3,2.8,-23.6,-3.6C-20.9,-10.1,-16.4,-15.3,-10.7,-21.1C-5,-27,-2.5,-33.5,2.4,-34.5C7.4,-35.5,14.7,-31,17.4,-20.9Z",
  "M23.1,-30.7C29.6,-24.4,34.4,-15.5,35.3,-6.2C36.2,3.1,33.3,12.9,27.3,18.4C21.3,23.9,12.2,25.1,2.5,26.5C-7.2,27.8,-17.7,29.3,-22.6,24.9C-27.5,20.5,-26.7,10.1,-24.6,1.4C-22.5,-7.3,-19.1,-13.6,-13.6,-20.1C-8.1,-26.6,-0.5,-33.3,6.8,-35.4C14.1,-37.5,21.2,-35.1,23.1,-30.7Z",
  "M20.2,-23C26.7,-19.2,33.1,-13.4,34.8,-6C36.4,1.4,33.3,10.1,28,15.4C22.7,20.7,15.1,22.6,8.5,21.9C1.9,21.2,-3.6,17.9,-8.8,14.1C-14,10.3,-18.8,6.1,-20.4,0.6C-22,-4.9,-20.4,-11.9,-16.7,-16.2C-13.1,-20.5,-7.3,-22,-1.3,-21.1C4.7,-20.2,9.4,-16.9,13.7,-15.2Z",
  "M24.7,-26.5C30.6,-19.1,33.7,-8.4,33.4,2.5C33.1,13.4,29.4,24.4,20.9,28.2C12.4,32,0.9,28.5,-7.2,24C-15.3,19.6,-22.9,14.2,-27.2,6.5C-31.4,-1.2,-32.3,-10.8,-28.9,-17.3C-25.5,-23.9,-18.1,-27.3,-10.2,-29.4C-2.3,-31.5,5.8,-32.3,11.8,-30.6C17.7,-28.9,23.1,-24.6,24.7,-26.5Z",
  "M20.1,-23.4C26.1,-20.1,30.7,-11.2,31.7,0.3C32.7,11.7,30.1,24,21.9,27.9C13.8,31.9,-1.9,27.4,-11.8,20.4C-21.7,13.4,-26.7,3.9,-25.9,-6.2C-25.1,-16.3,-18.4,-27,-9.6,-30.2C-0.8,-33.4,9.6,-29.2,20.1,-23.4Z",
  "M23.1,-30.7C29.6,-24.4,34.4,-15.5,35.3,-6.2C36.2,3.1,33.3,12.9,27.3,18.4C21.3,23.9,12.2,25.1,2.5,26.5C-7.2,27.8,-17.7,29.3,-22.6,24.9C-27.5,20.5,-26.7,10.1,-24.6,1.4C-22.5,-7.3,-19.1,-13.6,-13.6,-20.1C-8.1,-26.6,-0.5,-33.3,6.8,-35.4C14.1,-37.5,21.2,-35.1,23.1,-30.7Z",
];

const BLOB_GRID_SIZE = 80;
const MIN_BLOB_SIZE = 120;
const MAX_BLOB_SIZE = 160;
const NUMBER_OF_SHAPES = 20;
const MAX_OFFSET = 6;

const generateShapes = (cardDimensions = { width: 400, height: 200 }) => {
  const shapes = [];
  const numColumns = Math.floor(cardDimensions.width / BLOB_GRID_SIZE);
  const numRows = Math.floor(cardDimensions.height / BLOB_GRID_SIZE);
  let shapeCount = 0;

  for (let row = -1; row < numRows; row++) {
    for (let col = -1; col < numColumns; col++) {
      if (shapeCount >= NUMBER_OF_SHAPES) break;

      // Randomize the blob size for this specific blob
      const randomSize =
        Math.random() * (MAX_BLOB_SIZE - MIN_BLOB_SIZE) + MIN_BLOB_SIZE;

      // Calculate base grid position starting from (-40,40)
      const baseTop = row * BLOB_GRID_SIZE;
      const baseLeft = col * BLOB_GRID_SIZE;

      // Add a random offset for chaos
      const topOffset = Math.random() * MAX_OFFSET * 2 - MAX_OFFSET;
      const leftOffset = Math.random() * MAX_OFFSET * 2 - MAX_OFFSET;

      const top = baseTop + topOffset;
      const left = baseLeft + leftOffset;

      const randomOpacity = Math.random() * (0.5 - 0.1) + 0.5;
      const randomRotation = Math.random() * 360;
      const randomPath =
        BLOB_PATHS[Math.floor(Math.random() * BLOB_PATHS.length)];

      shapes.push({
        id: shapeCount,
        path: randomPath,
        style: {
          width: randomSize,
          height: randomSize,
          top: top,
          left: left,
          opacity: randomOpacity,
          transform: [{ rotate: `${randomRotation}deg` }],
        },
      });
      shapeCount++;
    }
  }
  return shapes;
};

const BlurCard = ({
  children,
  backgroundColor,
  colorScheme,
}: {
  children: ReactNode;
  backgroundColor: string;
  colorScheme: "dark" | "light";
}) => {
  const [blobs, setBlobs] = useState(generateShapes());

  const handleLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout;

    if (width > 0) {
      setBlobs(generateShapes({ width, height }));
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          borderRadius: SPACINGS.md,
        },
      ]}
    >
      <View
        style={[
          styles.cardContainer,
          {
            borderColor: backgroundColor,
            borderWidth: 2,
            borderRadius: SPACINGS.md,
          },
        ]}
        onLayout={handleLayout}
      >
        {blobs.map((blob) => (
          <View key={blob.id} style={[styles.blob, blob.style]}>
            <Svg
              id="sw-js-blob-svg"
              viewBox="0 0 100 100"
              width="100%"
              height="100%"
            >
              <Defs>
                <LinearGradient id="sw-gradient" x1="0" x2="1" y1="1" y2="0">
                  <Stop stopColor={backgroundColor} offset="0%"></Stop>
                  <Stop stopColor={backgroundColor} offset="100%"></Stop>
                </LinearGradient>
              </Defs>
              <Path
                fill="url(#sw-gradient)"
                d={blob.path}
                transform="translate(50, 50)"
              ></Path>
            </Svg>
          </View>
        ))}
        <BlurView
          intensity={60}
          tint={colorScheme}
          style={styles.card}
          experimentalBlurMethod="dimezisBlurView"
        >
          {children}
        </BlurView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    width: "100%",
    height: 200,
    overflow: "hidden",
  },
  blob: {
    position: "absolute",
  },
  card: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  cardText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
});

export default BlurCard;
