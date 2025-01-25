import React, { forwardRef, useCallback, useImperativeHandle } from "react";
import { StyleSheet } from "react-native";
import { Image } from "expo-image";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Piece, Square } from "@/models";
import { SQUARE_SIZE } from "@/constants/board";
import { toSquare } from "@/utils/toSquare";
import { toPosition } from "@/utils/toPosition";
import { useChess } from "@/contexts";

export type ChessPieceRef = {
  moveTo: (square: Square) => void;
};

type Props = {
  piece: Piece;
};

// eslint-disable-next-line react/display-name
export const ChessPiece = forwardRef<ChessPieceRef, Props>(({ piece }, ref) => {
  const { color, onMove } = useChess();
  const [y, x] = piece.square;

  const rotated = useSharedValue(color === "black");
  const position = useDerivedValue(
    () => toPosition([y, x], rotated.value),
    [x, y],
  );
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const translateX = useSharedValue(position.value.x);
  const translateY = useSharedValue(position.value.y);
  const isGestureActive = useSharedValue(false);
  const gestureEnabled = useSharedValue(piece.color === color);

  const moveTo = useCallback(
    (to: Square) => {
      const position = toPosition(to, rotated.value);
      translateX.value = withTiming(position.x);
      translateY.value = withTiming(position.y, {}, () => {
        isGestureActive.value = false;
      });
    },
    [isGestureActive, rotated.value, translateX, translateY],
  );

  const handleMove = useCallback(
    (to: Square) => {
      moveTo(to);
      onMove({ from: piece.square, to }).then((isValid) => {
        if (!isValid) {
          moveTo(piece.square);
        }
      });
    },
    [onMove, piece.square, moveTo],
  );

  const onSelect = useCallback(() => {}, []);

  useImperativeHandle(
    ref,
    () => ({
      moveTo: moveTo,
    }),
    [moveTo],
  );

  const tap = Gesture.Tap()
    .onTouchesDown(() => {
      offsetX.value = translateX.value;
      offsetY.value = translateY.value;
      runOnJS(onSelect)();
    })
    .enabled(gestureEnabled.value);

  const pan = Gesture.Pan()
    .onStart(() => {
      isGestureActive.value = true;
    })
    .onUpdate(({ translationX, translationY }) => {
      translateX.value = offsetX.value + translationX;
      translateY.value = offsetY.value + translationY;
    })
    .onEnd(() => {
      const to = toSquare(
        { x: translateX.value, y: translateY.value },
        rotated.value,
      );
      runOnJS(handleMove)(to);
    })
    .enabled(gestureEnabled.value);

  const pieceStyle = useAnimatedStyle(
    () => ({
      zIndex: isGestureActive.value ? 100 : 1,
      transform: [
        {
          translateX: translateX.value,
        },
        {
          translateY: translateY.value,
        },
      ],
    }),
    [],
  );

  const fromStyle = useAnimatedStyle(
    () => ({
      backgroundColor: "yellow",
      opacity: isGestureActive.value ? 1 : 0,
      transform: [
        {
          translateX: offsetX.value,
        },
        {
          translateY: offsetY.value,
        },
      ],
    }),
    [],
  );

  const toStyle = useAnimatedStyle(() => {
    const square = toSquare(
      {
        x: translateX.value,
        y: translateY.value,
      },
      rotated.value,
    );
    const position = toPosition(square, rotated.value);
    return {
      backgroundColor: "yellow",
      opacity: isGestureActive.value ? 1 : 0,
      transform: [
        {
          translateX: position.x,
        },
        {
          translateY: position.y,
        },
      ],
    };
  }, []);

  const composedGesture = Gesture.Simultaneous(tap, pan);

  return (
    <>
      <Animated.View style={[styles.container, toStyle]} />
      <Animated.View style={[styles.container, fromStyle]} />
      <GestureDetector gesture={composedGesture}>
        <Animated.View style={[styles.container, pieceStyle]}>
          <Image
            source={`${piece.type}${piece.color[0]}`}
            style={styles.image}
          />
        </Animated.View>
      </GestureDetector>
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: SQUARE_SIZE,
    height: SQUARE_SIZE,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    height: "70%",
    aspectRatio: 1,
  },
});
