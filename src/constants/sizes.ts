import { Dimensions } from "react-native";

const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
};

const WINDOW_WIDTH = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;
const PAGE_SIZE = 20;

export { FONT_SIZES, WINDOW_WIDTH, WINDOW_HEIGHT, PAGE_SIZE };
