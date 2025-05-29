import { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  View,
  Dimensions,
} from "react-native";

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");

export type SheetDirection = "bottom" | "left";

interface CustomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  animationDuration?: number;
  children?: React.ReactNode;
  direction?: SheetDirection;
  sheetWidth?: number;
  sheetHeight?: number;
}

export const CustomSheet: React.FC<CustomSheetProps> = ({
  isVisible,
  onClose,
  animationDuration = 200,
  children,
  direction = "bottom",
  sheetWidth = screenWidth * 0.75,
  sheetHeight = screenHeight * 0.5,
}) => {
  const slideAnim = useState(new Animated.Value(0))[0];

  // Determine the 'from' and 'to' values for the animation based on direction
  const getAnimationConfig = (dir: SheetDirection, isVisible: boolean) => {
    if (dir === "bottom") {
      return {
        from: isVisible ? 0 : sheetHeight, // Start at current position (0) or full height down
        to: isVisible ? sheetHeight : 0, // Animate to full height up (sheetHeight) or back to 0
      };
    } else {
      // 'left'
      return {
        from: isVisible ? 0 : sheetWidth, // Start at current position (0) or full width right
        to: isVisible ? sheetWidth : 0, // Animate to full width left (sheetWidth) or back to 0
      };
    }
  };

  useEffect(() => {
    // Set initial value directly to prevent flicker before animation
    const { from, to } = getAnimationConfig(direction, isVisible);
    slideAnim.setValue(isVisible ? to : from); // Set the initial position based on visibility

    Animated.timing(slideAnim, {
      toValue: isVisible ? 0 : to, // If visible, animate to 0 (off-screen for bottom, or left-most for left), otherwise animate to 'to'
      duration: animationDuration,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [
    isVisible,
    animationDuration,
    slideAnim,
    direction,
    sheetWidth,
    sheetHeight,
  ]); // Add new dependencies

  // Determine the animated style based on direction
  const animatedStyle =
    direction === "bottom"
      ? {
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, screenHeight],
                outputRange: [0, screenHeight],
              }),
            },
          ],
        }
      : {
          transform: [
            {
              translateX: slideAnim.interpolate({
                inputRange: [0, screenWidth],
                outputRange: [0, -screenWidth],
              }),
            },
          ],
        };

  // Determine the base style for the sheet content
  const sheetBaseStyle =
    direction === "bottom"
      ? {
          left: 0,
          right: 0,
          bottom: 0,
          height: sheetHeight, // Apply explicit height
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }
      : {
          top: 0,
          bottom: 0,
          left: 0,
          width: sheetWidth, // Apply explicit width
          borderTopRightRadius: 10,
          borderBottomRightRadius: 10,
        };

  return (
    <Modal transparent={true} visible={isVisible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={onClose}
          activeOpacity={1}
        />
        <Animated.View
          style={[styles.sheetBase, sheetBaseStyle, animatedStyle]}
        >
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end", // Align content to bottom by default
    alignItems: "flex-start", // Align content to left by default for left sheet
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  sheetBase: {
    position: "absolute",
    backgroundColor: "white",
    padding: 20,
    overflow: "hidden", // Ensures rounded corners are respected
  },
});
