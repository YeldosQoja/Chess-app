import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  Dimensions,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import {
  Board as BoardType,
  IPiece,
  IStrategy,
  PawnPromotion,
  PieceType,
  Player,
  Square,
  Strategy,
} from "@/models";
import { useChess } from "@/hooks/useChess";
import { useWs } from "@/hooks/useWs";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import lodash from "lodash";
import images from "@/assets/images/chess";

const { width } = Dimensions.get("window");
const SQUARE_SIZE = width / 8;
const COLORS = {
  light: "rgb(234,240,206)",
  dark: "rgb(187,190,100)",
};

const ChessContext = createContext<{
  white: Player | null;
  black: Player | null;
  board: BoardType;
  selectedPiece: IPiece | null;
  promotionPickerOpen: boolean;
  pawnPromotions: { image: any; strategy: Strategy }[];
  selectPiece: (piece: IPiece) => void;
  move: (square: Square) => void;
  selectPromotion: (promotion: PawnPromotion) => void;
  togglePromotionPicker: () => void;
}>({
  white: null,
  black: null,
  board: Array(8).fill(Array(8).fill(null)),
  selectedPiece: null,
  promotionPickerOpen: false,
  pawnPromotions: [],
  selectPiece: (piece: IPiece) => {},
  move: (square: Square) => {},
  selectPromotion: () => {},
  togglePromotionPicker: () => {},
});

export const Chess = ({ children }: PropsWithChildren) => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [game, pawnPromotions] = useChess();
  const ws = useWs(`ws://127.0.0.1:8000/ws/games/room-${id}/`);

  const [selectedPiece, setSelectedPiece] = useState<IPiece | null>(null);
  const [board, setBoard] = useState<BoardType>(game.board);
  const [promotionPickerOpen, setPromotionPickerOpen] = useState(false);

  useEffect(() => {
    ws.onopen = (e) => {
      console.log("connected", e);
    };

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log(data);
      if (data.msg_type === "move") {
        const { from, to } = data;
        move(from, to);
      } else if (data.msg_type === "promote") {
        const { square, piece } = data;
        promotePawn(square, piece);
      }
    };

    ws.onerror = (e) => {
      console.log("error", e);
    };

    return () => {
      ws.close();
    };
  }, []);

  const sendMove = useCallback((square: Square) => {
    if (selectedPiece) {
      const { owner, currentSquare } = selectedPiece;
      ws.send(
        JSON.stringify({
          command: "move",
          player: owner.getColor(),
          from: currentSquare,
          to: square,
        })
      );
    }
  }, [selectedPiece]);

  const sendPromotion = useCallback((promotion: PawnPromotion) => {
    if (selectedPiece) {
      const { owner, currentSquare } = selectedPiece;
      ws.send(
        JSON.stringify({
          command: "promote",
          player: owner.getColor(),
          square: currentSquare,
          piece: promotion.strategy.type,
        })
      );
    }
  }, [selectedPiece]);

  const move = useCallback((from: Square, to: Square) => {
    const [rank, file] = from;
    const piece = game.board[rank][file] as IPiece;
    game.move(piece, to);
    setBoard(game.board);
    setSelectedPiece(null);
  }, []);

  const promotePawn = useCallback((square: Square, pieceType: PieceType) => {
    const [rank, file] = square;
    const piece = game.board[rank][file] as IPiece;
    const promotion = pawnPromotions.find((p) => p.strategy.type === pieceType);
    const strategy = promotion?.strategy as IStrategy;
    piece.updateStrategy(strategy);
    togglePromotionPicker();
  }, []);

  const handleSelectPiece = useCallback((piece: IPiece) => {
    if (game.activePlayer === piece.owner) {
      setSelectedPiece(piece);
    }
  }, []);

  const togglePromotionPicker = useCallback(() => {
    setPromotionPickerOpen((value) => !value);
  }, []);

  const { white, black } = game;

  return (
    <ChessContext.Provider
      value={{
        white,
        black,
        board,
        selectedPiece,
        promotionPickerOpen,
        pawnPromotions,
        selectPiece: handleSelectPiece,
        move: sendMove,
        selectPromotion: sendPromotion,
        togglePromotionPicker,
      }}>
      {children}
    </ChessContext.Provider>
  );
};

const boardStyles = StyleSheet.create({
  board: {
    width,
    aspectRatio: 1,
  },
  row: {
    width: "100%",
    flexDirection: "row",
  },
  square: {
    width: SQUARE_SIZE,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    backgroundColor: "rgba(0.0, 0.0, 0.0, 0.2)",
    width: "30%",
    aspectRatio: 1,
    borderRadius: 100,
  },
});

type BoardProps = {
  isWhite: boolean;
};

const Board = ({ isWhite }: PropsWithChildren<BoardProps>) => {
  const { white, black, board, selectedPiece, selectPiece, move } =
    useContext(ChessContext);

  return (
    <View
      style={[
        boardStyles.board,
        { transform: [{ rotate: isWhite ? "0deg" : "180deg" }] },
      ]}>
      {/* Tiles */}
      {board.map((row, rank) => {
        const isEvenRank = rank % 2 === 0;
        const colors = [
          isEvenRank ? COLORS.light : COLORS.dark,
          isEvenRank ? COLORS.dark : COLORS.light,
        ];
        return (
          <View
            key={rank}
            style={boardStyles.row}>
            {row.map((_, file) => (
              <View
                key={file}
                style={{
                  backgroundColor: colors[file % 2],
                  ...boardStyles.square,
                }}
              />
            ))}
          </View>
        );
      })}
      {/* Valid moves */}
      {selectedPiece !== null &&
        selectedPiece.getValidMoves().map(([rank, file]) => (
          <View
            key={"" + rank + file}
            style={[
              {
                position: "absolute",
                top: SQUARE_SIZE * rank,
                left: SQUARE_SIZE * file,
              },
              boardStyles.square,
            ]}>
            <View style={boardStyles.dot} />
          </View>
        ))}
      {white !== null &&
        white.pieces
          .filter((p) => !p.isCaptured)
          .map((piece) => (
            <Piece
              key={piece.id}
              isWhite={isWhite}
              piece={piece}
              active={isWhite}
              selected={selectedPiece?.id === piece.id}
              onSelect={selectPiece}
            />
          ))}
      {black &&
        black.pieces
          .filter((p) => !p.isCaptured)
          .map((piece) => (
            <Piece
              key={piece.id}
              isWhite={isWhite}
              piece={piece}
              active={!isWhite}
              selected={selectedPiece?.id === piece.id}
              onSelect={selectPiece}
            />
          ))}
      {/* Moves */}
      <View style={StyleSheet.absoluteFill}>
        {board.map((row, rank) => (
          <View
            key={rank}
            style={boardStyles.row}>
            {row.map((_, file) => (
              <TouchableOpacity
                key={file}
                style={boardStyles.square}
                onPress={() => move([rank, file])}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const pieceStyles = StyleSheet.create({
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

interface PieceProps {
  isWhite: boolean;
  piece: IPiece;
  active: boolean;
  selected: boolean;
  onSelect: (piece: IPiece) => void;
}

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

export const Piece = ({
  isWhite,
  piece,
  active,
  selected,
  onSelect,
}: PieceProps) => {
  const [rank, file] = piece.currentSquare;
  const pieceType = piece.getType();

  const { togglePromotionPicker } = useContext(ChessContext);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      left: withTiming(SQUARE_SIZE * file),
      top: withTiming(SQUARE_SIZE * rank),
    };
  }, [rank, file]);
  
  useEffect(() => {
    if ((isWhite && rank === 0) || (!isWhite && rank === 7)) {
      togglePromotionPicker();
    }
  }, [rank]);

  return (
    <AnimatedTouchableOpacity
      activeOpacity={0.9}
      style={[
        pieceStyles.container,
        {
          zIndex: active ? 1 : 0,
          transform: [{ rotate: isWhite ? "0deg" : "180deg" }],
          backgroundColor: selected ? "yellow" : "transparent",
        },
        animatedStyles,
      ]}
      onPress={() => {
        onSelect(piece);
      }}>
      <Image
        source={lodash.get(
          images,
          `${pieceType}.${piece.isWhite ? "white" : "black"}`
        )}
        style={pieceStyles.image}
      />
    </AnimatedTouchableOpacity>
  );
};

const pickerStyles = StyleSheet.create({
  modal: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    backgroundColor: "white",
    width: "30%",
    aspectRatio: 1,
    borderRadius: 12,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  pieceItem: {
    width: "50%",
    height: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  pieceImage: {
    height: "70%",
    aspectRatio: 1,
  },
});

interface Props {
  isWhite: boolean;
}

export const PromotionPicker = ({ isWhite }: Props) => {
  const playerColor = isWhite ? "white" : "black";

  const {
    pawnPromotions: items,
    promotionPickerOpen: open,
    selectPromotion,
  } = useContext(ChessContext);

  return (
    <Modal
      style={pickerStyles.modal}
      animationType="none"
      transparent={true}
      visible={open}>
      <View style={pickerStyles.container}>
        <View style={pickerStyles.content}>
          {items.map((promotion, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.9}
              style={pickerStyles.pieceItem}
              onPress={() => void selectPromotion(promotion)}>
              <Image
                source={promotion.image[playerColor]}
                style={pickerStyles.pieceImage}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
};

Chess.Board = Board;
Chess.PromotionPicker = PromotionPicker;
