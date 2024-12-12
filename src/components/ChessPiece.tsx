import { useCallback, useContext, useEffect } from "react";
import { StyleSheet } from "react-native";
import { Image } from "expo-image";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { ChessContext } from "@/providers";
import { IPiece, Square } from "@/models";
import { SQUARE_SIZE } from "@/constants/board";
import { toSquare } from "@/utils/toSquare";

interface PieceProps {
  piece: IPiece;
}

export const ChessPiece = ({ piece }: PieceProps) => {
  const {
    selectedPiece,
    selectPiece,
    player,
    move,
    gameState: { activePlayer },
  } = useContext(ChessContext);

  const active = player === piece.owner.getColor();
  const enabled =
    piece.owner.getColor() === player &&
    piece.owner.getColor() === activePlayer;
  const selected = selectedPiece === piece;
  const [rank, file] = piece.currentSquare;

  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const translateX = useSharedValue(SQUARE_SIZE * file);
  const translateY = useSharedValue(SQUARE_SIZE * rank);
  const isGestureActive = useSharedValue(false);
  const flip = useSharedValue(player === "black");

  useEffect(() => {
    if (
      translateX.value !== SQUARE_SIZE * file ||
      translateY.value !== SQUARE_SIZE * rank
    ) {
      translateX.value = withTiming(SQUARE_SIZE * file);
      translateY.value = withTiming(SQUARE_SIZE * rank);
    }
  }, [rank, file, translateX, translateY]);

  const onMove = useCallback(
    (to: Square) => {
      if (piece.isValidMove(to)) {
        move(to);
        const [rank, file] = to;
        translateX.value = withTiming(file * SQUARE_SIZE);
        translateY.value = withTiming(rank * SQUARE_SIZE, {}, () => {
          isGestureActive.value = false;
        });
      } else {
        translateX.value = withTiming(offsetX.value);
        translateY.value = withTiming(offsetY.value, {}, () => {
          isGestureActive.value = false;
        });
      }
    },
    [
      piece,
      move,
      translateX,
      translateY,
      isGestureActive,
      offsetX.value,
      offsetY.value,
    ],
  );

  const onSelect = useCallback(() => {
    selectPiece(piece);
  }, [selectPiece, piece]);

  const tap = Gesture.Tap()
    .onTouchesDown(() => {
      offsetX.value = translateX.value;
      offsetY.value = translateY.value;
      runOnJS(onSelect)();
    })
    .enabled(enabled);

  const pan = Gesture.Pan()
    .onStart(() => {
      isGestureActive.value = true;
    })
    .onUpdate(({ translationX, translationY }) => {
      const multiplier = flip.value ? -1 : 1;
      translateX.value = offsetX.value + translationX * multiplier;
      translateY.value = offsetY.value + translationY * multiplier;
    })
    .onEnd(() => {
      const to = toSquare({ x: translateX.value, y: translateY.value });
      runOnJS(onMove)(to);
    })
    .enabled(enabled);

  const pieceStyle = useAnimatedStyle(
    () => ({
      zIndex: isGestureActive.value ? 100 : active ? 10 : 1,
      transform: [
        {
          translateX: translateX.value,
        },
        {
          translateY: translateY.value,
        },
        {
          rotate: flip.value ? `${Math.PI}rad` : "0rad",
        },
      ],
    }),
    [selected, active],
  );

  const fromStyle = useAnimatedStyle(
    () => ({
      backgroundColor: "yellow",
      opacity: isGestureActive.value || selected ? 1 : 0,
      transform: [
        {
          translateX: offsetX.value,
        },
        {
          translateY: offsetY.value,
        },
      ],
    }),
    [selected],
  );

  const toStyle = useAnimatedStyle(() => {
    const [rank, file] = toSquare({ x: translateX.value, y: translateY.value });
    const x = file * SQUARE_SIZE;
    const y = rank * SQUARE_SIZE;
    return {
      backgroundColor: "yellow",
      opacity: isGestureActive.value ? 1 : 0,
      transform: [
        {
          translateX: x,
        },
        {
          translateY: y,
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
            source={`${piece.getType()}-${piece.owner.getColor()}`}
            style={styles.image}
          />
        </Animated.View>
      </GestureDetector>
    </>
  );
};

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
