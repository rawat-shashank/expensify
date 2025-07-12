import { Dimensions } from "react-native";
import { colors } from "./colors";

const WINDOW_WIDTH = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;
const PAGE_SIZE = 20;

export { WINDOW_WIDTH, WINDOW_HEIGHT, PAGE_SIZE, colors };
