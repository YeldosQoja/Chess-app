import React from "react";
import { StyleSheet, Image, TouchableOpacity, Dimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import lodash from "lodash";
import { IPiece } from "@/models";
import images from "@/assets/images/chess";

interface Props {
  isWhite: boolean;
  piece: IPiece;
  active: boolean;
  selected: boolean;
  onSelect: (piece: IPiece) => void;
}

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const { width } = Dimensions.get("screen");
const SQUARE_SIZE = width / 8;

export const ChessPiece = ({
  isWhite,
  piece,
  active,
  selected,
  onSelect,
}: Props) => {
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
        {
          zIndex: active ? 1 : 0,
          transform: [{ rotate: isWhite ? "0deg" : "180deg" }],
        },
        selected && {
          backgroundColor: "yellow",
        },
        animatedStyles,
      ]}
      onPress={() => {
        onSelect(piece);
      }}>
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
