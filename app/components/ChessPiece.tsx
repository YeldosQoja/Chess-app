import { StyleSheet, Image, TouchableOpacity, Dimensions } from "react-native";
import React from "react";
import { IPiece } from "../models";
import images from "../assets/images/chess";
import lodash from "lodash";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

interface Props {
  piece: IPiece;
  onSelect: (square: [number, number]) => void;
  selected: boolean;
};

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const { width } = Dimensions.get("screen");
const SQUARE_SIZE = width / 8;

export const ChessPiece = ({ piece, onSelect, selected }: Props) => {
  const [rank, file] = piece.currentSquare;

  const animatedStyles = useAnimatedStyle(() => {
    return {
      left: withTiming(SQUARE_SIZE * file),
      top: withTiming(SQUARE_SIZE * rank),
    };
  }, [rank, file]);

  return (
    <AnimatedTouchableOpacity
      activeOpacity={0.9}
      style={[
        styles.container,
        animatedStyles,
        selected && {
          backgroundColor: "yellow",
        },
      ]}
      onPress={() => void onSelect(piece.currentSquare)}>
      <Image
        source={lodash.get(
          images,
          `${piece.getType()}.${piece.isWhite ? "white" : "black"}`
        )}
        style={styles.image}
      />
    </AnimatedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: `${100 / 8}%`,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    height: "70%",
    aspectRatio: 1,
  },
});
