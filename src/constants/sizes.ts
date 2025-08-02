import { Dimensions } from "react-native";

const SPACINGS = {
  tiny: 4,
  xxs: 6,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

const FONT_SIZES = {
  caption: 12, // Captions, helper text
  small: 14, // Secondary text, small labels
  body: 16, // Standard body text (good default for readability)
  subheading: 18, // Subheadings
  h5: 20,
  h4: 24,
  h3: 28,
  h2: 32,
  h1: 36,
};

const WINDOW_WIDTH = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;
const PAGE_SIZE = 20;

export { SPACINGS, FONT_SIZES, WINDOW_WIDTH, WINDOW_HEIGHT, PAGE_SIZE };
