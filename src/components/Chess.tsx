import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
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
  User,
} from "@/models";
import { useChess } from "@/hooks/useChess";
import { useWs } from "@/hooks/useWs";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import lodash from "lodash";
import images from "@/assets/images/chess";
import { useAppTheme } from "@/providers";
import { Avatar } from "react-native-paper";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

const { width } = Dimensions.get("window");
const SQUARE_SIZE = width / 8;
const COLORS = {
  light: "rgb(234,240,206)",
  dark: "rgb(187,190,100)",
};

const ChessContext = createContext<{
  player: false | { isWhite: boolean };
  white: Player | null;
  black: Player | null;
  next: "White" | "Black";
  board: BoardType;
  selectedPiece: IPiece | null;
  promotionPickerOpen: boolean;
  pawnPromotions: { image: any; strategy: Strategy }[];
  selectPiece: (piece: IPiece) => void;
  move: (square: Square) => void;
  selectPromotion: (promotion: PawnPromotion) => void;
  lastMovedAt?: Date;
}>({
  player: false,
  white: null,
  black: null,
  next: "White",
  board: Array(8).fill(Array(8).fill(null)),
  selectedPiece: null,
  promotionPickerOpen: false,
  pawnPromotions: [],
  selectPiece: (piece: IPiece) => {},
  move: (square: Square) => {},
  selectPromotion: () => {},
});

type ChessProps = {
  player: false | { isWhite: boolean };
};

export const Chess = ({ children, player }: PropsWithChildren<ChessProps>) => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [game, pawnPromotions] = useChess();
  const ws = useWs(`ws://127.0.0.1:8000/ws/games/room-${id}/`);

  const [selectedPiece, setSelectedPiece] = useState<IPiece | null>(null);
  const [board, setBoard] = useState<BoardType>(game.board);
  const [promotionPickerOpen, setPromotionPickerOpen] = useState(false);
  const [lastMovedAt, setLastMovedAt] = useState<Date>();
  const [startedAt, setStartedAt] = useState<Date>();

  useEffect(() => {
    ws.onopen = (e) => {
      console.log("connected", e);
    };

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log(data);
      if (data.msg_type === "move") {
        const { from, to, timestamp } = data;
        move(from, to, new Date(timestamp));
      } else if (data.msg_type === "promote") {
        const { square, piece, timestamp } = data;
        promotePawn(square, piece, new Date(timestamp));
      }
    };

    ws.onerror = (e) => {
      console.log("error", e);
    };

    return () => {
      ws.close();
    };
  }, []);

  const sendMove = useCallback(
    (square: Square) => {
      if (selectedPiece) {
        const { owner, currentSquare } = selectedPiece;
        ws.send(
          JSON.stringify({
            command: "move",
            player: owner.getColor(),
            from: currentSquare,
            to: square,
            timestamp: Date.now(),
          })
        );
      }
    },
    [selectedPiece]
  );

  const sendPromotion = useCallback(
    (promotion: PawnPromotion) => {
      if (selectedPiece) {
        const { owner, currentSquare } = selectedPiece;
        ws.send(
          JSON.stringify({
            command: "promote",
            player: owner.getColor(),
            square: currentSquare,
            piece: promotion.strategy.type,
            timestamp: Date.now(),
          })
        );
      }
    },
    [selectedPiece]
  );

  const move = useCallback((from: Square, to: Square, timestamp: Date) => {
    const [rank, file] = from;
    const piece = game.board[rank][file] as IPiece;
    game.move(piece, to);
    if (!piece.isPromotion()) {
      if (startedAt === undefined) {
        setStartedAt(timestamp);
      }
      setLastMovedAt(timestamp);
      setBoard(game.board);
      setSelectedPiece(null);
    } else if (player && player.isWhite === piece.isWhite) {
      setPromotionPickerOpen(true);
    }
  }, []);

  const promotePawn = useCallback(
    (square: Square, pieceType: PieceType, timestamp: Date) => {
      const [rank, file] = square;
      const piece = game.board[rank][file] as IPiece;
      const promotion = pawnPromotions.find(
        (p) => p.strategy.type === pieceType
      );
      const strategy = promotion?.strategy as IStrategy;
      game.updateStrategy(piece, strategy);
      setLastMovedAt(timestamp);
      setBoard(game.board);
      setSelectedPiece(null);
      setPromotionPickerOpen(false);
    },
    []
  );

  const handleSelectPiece = useCallback((piece: IPiece) => {
    if (game.activePlayer === piece.owner) {
      setSelectedPiece(piece);
    }
  }, []);

  const { white, black, activePlayer } = game;

  return (
    <ChessContext.Provider
      value={{
        player,
        white,
        black,
        next: activePlayer.getColor(),
        board,
        selectedPiece,
        promotionPickerOpen,
        pawnPromotions,
        selectPiece: handleSelectPiece,
        move: sendMove,
        selectPromotion: sendPromotion,
        lastMovedAt,
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

type BoardProps = {};

const Board = ({}: PropsWithChildren<BoardProps>) => {
  const { player, white, black, board, selectedPiece, move } =
    useContext(ChessContext);

  const flip = player && !player.isWhite;

  return (
    <View
      style={[
        boardStyles.board,
        { transform: [{ rotate: flip ? "180deg" : "0deg" }] },
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
      {/* Valid move markers */}
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
              piece={piece}
            />
          ))}
      {black &&
        black.pieces
          .filter((p) => !p.isCaptured)
          .map((piece) => (
            <Piece
              key={piece.id}
              piece={piece}
            />
          ))}
      {/* Moves */}
      {selectedPiece !== null &&
        selectedPiece.getValidMoves().map(([rank, file]) => (
          <TouchableOpacity
            key={"" + rank + file}
            style={[
              {
                position: "absolute",
                top: SQUARE_SIZE * rank,
                left: SQUARE_SIZE * file,
              },
              boardStyles.square,
            ]}
            onPress={() => move([rank, file])}
          />
        ))}
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
  piece: IPiece;
}

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

export const Piece = ({ piece }: PieceProps) => {
  const { selectPiece, selectedPiece, player } = useContext(ChessContext);

  const selected = piece.id === selectedPiece?.id;

  const flip = player && !player.isWhite;

  const active = player && player.isWhite === piece.isWhite;

  const [rank, file] = piece.currentSquare;

  const pieceType = piece.getType();

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
        pieceStyles.container,
        {
          zIndex: active ? 1 : 0,
          transform: [{ rotate: flip ? "180deg" : "0deg" }],
          backgroundColor: selected ? "yellow" : "transparent",
        },
        animatedStyles,
      ]}
      onPress={() => {
        selectPiece(piece);
      }}
      disabled={!player || piece.isWhite !== player.isWhite}>
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
  item: {
    width: "50%",
    height: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    height: "70%",
    aspectRatio: 1,
  },
});

interface PromotionPickerProps {}

export const PromotionPicker = ({}: PromotionPickerProps) => {
  const { player } = useContext(ChessContext);
  const playerColor = player && player.isWhite ? "white" : "black";

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
              style={pickerStyles.item}
              onPress={() => void selectPromotion(promotion)}>
              <Image
                source={promotion.image[playerColor]}
                style={pickerStyles.image}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
};

const cardStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    padding: 12,
  },
  name: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    marginLeft: 6,
  },
  timer: {
    padding: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    fontVariant: ["tabular-nums"],
  },
  timerText: {
    fontSize: 17,
    fontWeight: "500",
  },
});

type ProfileCardProps = {
  profile: User;
  isWhite: boolean;
};

export const ProfileCard = ({
  profile: { avatar, firstName, lastName },
  isWhite,
}: ProfileCardProps) => {
  const { colors } = useAppTheme();

  const { next, lastMovedAt } = useContext(ChessContext);

  const [secondsRemaining, setSecondsRemaining] = useState(600);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const timer = useRef<ReturnType<typeof setInterval>>(null);

  useEffect(() => {
    if (
      lastMovedAt &&
      ((isWhite && next === "White") || (!isWhite && next === "Black"))
    ) {
      // @ts-ignore
      timer.current = setInterval(() => {
        console.log("interval");
        // setSecondsRemaining(sec => sec - 1);
        const elapsedTime = Date.now() - lastMovedAt.getTime();
        console.log({ elapsedTime });
        setElapsedSeconds(Math.floor(elapsedTime / 1000));
      }, 1000);
    }
    return () => {
      if (timer.current && lastMovedAt) {
        clearInterval(timer.current);
        setSecondsRemaining((sec) => sec - elapsedSeconds);
        setElapsedSeconds(0);
      }
    };
  }, [next, lastMovedAt, isWhite]);

  return (
    <View style={[cardStyles.container, { backgroundColor: colors.card }]}>
      <Avatar.Image
        // @ts-ignore
        source={{ uri: avatar }}
        size={40}
      />
      <Text
        style={[
          cardStyles.name,
          { color: colors.text },
        ]}>{`${firstName} ${lastName}`}</Text>
      <View
        style={[
          cardStyles.timer,
          {
            backgroundColor: isWhite ? "#e8e8e8" : "#282828",
          },
        ]}>
        <Text
          style={[
            cardStyles.timerText,
            { color: isWhite ? "#282828" : "#e8e8e8" },
          ]}>
          {dayjs
            .duration(secondsRemaining - elapsedSeconds, "seconds")
            .format("mm:ss")}
        </Text>
      </View>
    </View>
  );
};

Chess.Board = Board;
Chess.PromotionPicker = PromotionPicker;
Chess.ProfileCard = ProfileCard;
