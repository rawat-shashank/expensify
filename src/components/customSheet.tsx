import { WINDOW_WIDTH } from "@/constants";
import { useTheme } from "@/context/ThemeContext";
import { useEffect, useState, useRef } from "react";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  View,
} from "react-native";

export type SheetDirection = "bottom" | "left";

interface CustomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  animationDuration?: number;
  children?: React.ReactNode;
  direction?: SheetDirection;
}

export const CustomSheet: React.FC<CustomSheetProps> = ({
  isVisible,
  onClose,
  animationDuration = 200,
  children,
  direction = "bottom",
}) => {
  const { theme } = useTheme();
  const slideAnim = useState(new Animated.Value(0))[0];
  const [contentHeight, setContentHeight] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const isInitialRender = useRef(true);

  useEffect(() => {
    if (
      (direction === "bottom" && contentHeight === 0) ||
      (direction === "left" && contentWidth === 0)
    ) {
      return;
    }

    let toValue = 0;
    if (direction === "bottom") {
      toValue = isVisible ? 0 : contentHeight;
    } else {
      toValue = isVisible ? 0 : contentWidth;
    }

    if (isInitialRender.current) {
      slideAnim.setValue(isVisible ? 0 : toValue);
      isInitialRender.current = false;
    } else {
      Animated.timing(slideAnim, {
        toValue: toValue,
        duration: animationDuration,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [
    isVisible,
    animationDuration,
    slideAnim,
    direction,
    contentHeight,
    contentWidth,
  ]);

  const onContentLayout = (event: any) => {
    const { height, width } = event.nativeEvent.layout;
    if (direction === "bottom" && height !== contentHeight) {
      setContentHeight(height);
      if (isVisible) {
        slideAnim.setValue(0);
      } else {
        slideAnim.setValue(height);
      }
    } else if (direction === "left" && width !== contentWidth) {
      setContentWidth(width);
      if (isVisible) {
        slideAnim.setValue(0);
      } else {
        slideAnim.setValue(width);
      }
    }
  };

  const animatedStyle =
    direction === "bottom"
      ? {
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, contentHeight > 0 ? contentHeight : 1],
                outputRange: [0, contentHeight],
              }),
            },
          ],
        }
      : {
          transform: [
            {
              translateX: slideAnim.interpolate({
                inputRange: [0, contentWidth > 0 ? contentWidth : 1],
                outputRange: [0, -contentWidth],
              }),
            },
          ],
        };

  const sheetBaseStyle =
    direction === "bottom"
      ? {
          left: 0,
          right: 0,
          bottom: 0,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }
      : {
          top: 0,
          bottom: 0,
          left: 0,
          minWidth: WINDOW_WIDTH * 0.7,
          borderTopRightRadius: 8,
          borderBottomRightRadius: 8,
        };

  return (
    <Modal transparent={true} visible={isVisible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <TouchableOpacity
          style={[
            styles.modalOverlay,
            {
              backgroundColor: theme.backdrop,
            },
          ]}
          onPress={onClose}
          activeOpacity={1}
        />
        <Animated.View
          style={[
            styles.sheetBase,
            sheetBaseStyle,
            animatedStyle,
            {
              backgroundColor: theme.background,
            },
          ]}
          onLayout={onContentLayout}
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
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  sheetBase: {
    position: "absolute",
    backgroundColor: "white",
    padding: 20,
    overflow: "hidden",
  },
});
