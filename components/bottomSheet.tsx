import { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  Easing,
  View,
} from "react-native";

interface CustomBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  label: string;
  animationDuration?: number;
}

export const CustomBottomSheet: React.FC<CustomBottomSheetProps> = ({
  isVisible,
  onClose,
  label,
  animationDuration = 200,
}) => {
  const slideAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isVisible ? 0 : 1,
      duration: animationDuration,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [isVisible, animationDuration, slideAnim]);

  return (
    <Modal transparent={true} visible={isVisible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={onClose}
          activeOpacity={1}
        />
        <Animated.View style={styles.bottomSheet}>
          <View>
            {label && <Text style={styles.label}>{label}</Text>}
            <>
              <TextInput
                style={styles.input}
                placeholder={`Enter ${label.toLowerCase()}`}
              />
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text>Close</Text>
              </TouchableOpacity>
            </>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  bottomSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: "white",
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  closeButton: {
    padding: 10,
    alignItems: "center",
    backgroundColor: "#eee",
    borderRadius: 5,
  },
});
