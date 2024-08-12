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
  Chess as Game,
  Board as BoardType,
  IPiece,
  IStrategy,
  PawnPromotion,
  PieceType,
  Player,
  Square,
  Strategy,
  User,
  QueenStrategy,
  KnightStrategy,
  RookStrategy,
  BishopStrategy,
} from "@/models";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import lodash from "lodash";
import { useAppTheme } from "@/providers";
import { Avatar } from "react-native-paper";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { useLazy } from "@/hooks/useLazy";
import images from "@/assets/images/chess";

const { queen, knight, bishop, rook } = images;

dayjs.extend(duration);

const { width } = Dimensions.get("window");
const SQUARE_SIZE = width / 8;
const COLORS = {
  light: "rgb(234,240,206)",
  dark: "rgb(187,190,100)",
};

type GameState = {
  activePlayer: "White" | "Black";
  board: BoardType;
  lastMovedAt: {
    White: Date | null;
    Black: Date | null;
  };
};

const ChessContext = createContext<{
  selectedPiece: IPiece | null;
  game: GameState;
  player?: "White" | "Black";
  white: Player | null;
  black: Player | null;
  promotionPickerOpen: boolean;
  pawnPromotions: { image: any; strategy: Strategy }[];
  selectPiece: (piece: IPiece) => void;
  move: (square: Square) => void;
  selectPromotion: (promotion: PawnPromotion) => void;
}>({
  selectedPiece: null,
  game: {
    activePlayer: "White",
    board: Array(8).fill(Array(8).fill(null)),
    lastMovedAt: {
      White: null,
      Black: null,
    },
  },
  white: null,
  black: null,
  promotionPickerOpen: false,
  pawnPromotions: [],
  selectPiece: (piece: IPiece) => {},
  move: (square: Square) => {},
  selectPromotion: () => {},
});

type ChessProps = {
  player?: "White" | "Black";
};

export const Chess = ({ children, player }: PropsWithChildren<ChessProps>) => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const chess = useLazy(() => new Game());
  const pawnPromotions = useRef([
    {
      image: queen,
      strategy: new QueenStrategy(chess),
    },
    {
      image: knight,
      strategy: new KnightStrategy(chess),
    },
    {
      image: bishop,
      strategy: new BishopStrategy(chess),
    },
    {
      image: rook,
      strategy: new RookStrategy(chess),
    },
  ]);
  const ws = useLazy(
    () => new WebSocket(`ws://127.0.0.1:8000/ws/games/room-${id}/`)
  );
  
  const [game, setGame] = useState<GameState>({
    activePlayer: "White",
    board: chess.board,
    lastMovedAt: {
      White: null,
      Black: null,
    },
  });
  const [selectedPiece, setSelectedPiece] = useState<IPiece | null>(null);
  const [promotionPickerOpen, setPromotionPickerOpen] = useState(false);
  const [startedAt, setStartedAt] = useState<Date>();

  useEffect(() => {
    console.log("player", player);
    ws.onopen = (e) => {
      console.log("connected", e);
    };

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log(data, new Date(data.timestamp).toLocaleTimeString());
      if (data.player === player) {
        return;
      }
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
        const timestamp = Date.now();
        move(currentSquare, square, new Date());
        ws.send(
          JSON.stringify({
            command: "move",
            player: owner.getColor(),
            from: currentSquare,
            to: square,
            timestamp,
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
        const timestamp = Date.now();
        const pieceType = promotion.strategy.type;
        promotePawn(currentSquare, pieceType, new Date());
        ws.send(
          JSON.stringify({
            command: "promote",
            player: owner.getColor(),
            square: currentSquare,
            piece: pieceType,
            timestamp,
          })
        );
      }
    },
    [selectedPiece]
  );

  const move = useCallback((from: Square, to: Square, timestamp: Date) => {
    console.log("move");
    const [rank, file] = from;
    const piece = chess.board[rank][file] as IPiece;
    const color = piece.owner.getColor();
    chess.move(piece, to);
    if (!piece.isPromotion()) {
      if (startedAt === undefined) {
        setStartedAt(timestamp);
      }
      setGame((prev) => ({
        activePlayer: chess.activePlayer.getColor(),
        board: chess.board,
        lastMovedAt: {
          ...prev.lastMovedAt,
          [color]: timestamp,
        },
      }));
      setSelectedPiece(null);
    } else if (player === piece.owner.getColor()) {
      setPromotionPickerOpen(true);
    }
  }, []);

  const promotePawn = useCallback(
    (square: Square, pieceType: PieceType, timestamp: Date) => {
      const [rank, file] = square;
      const piece = chess.board[rank][file] as IPiece;
      const color = piece.owner.getColor();
      const promotion = pawnPromotions.current.find(
        (p) => p.strategy.type === pieceType
      );
      const strategy = promotion?.strategy as IStrategy;
      chess.updateStrategy(piece, strategy);
      setGame((prev) => ({
        activePlayer: chess.activePlayer.getColor(),
        board: chess.board,
        lastMovedAt: {
          ...prev.lastMovedAt,
          [color]: timestamp,
        },
      }));
      setSelectedPiece(null);
      setPromotionPickerOpen(false);
    },
    []
  );

  const handleSelectPiece = useCallback((piece: IPiece) => {
    if (chess.activePlayer === piece.owner) {
      setSelectedPiece(piece);
    }
  }, []);

  const { white, black } = chess;

  return (
    <ChessContext.Provider
      value={{
        selectedPiece,
        game,
        player,
        white,
        black,
        promotionPickerOpen,
        pawnPromotions: pawnPromotions.current,
        selectPiece: handleSelectPiece,
        move: sendMove,
        selectPromotion: sendPromotion,
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
  const { selectedPiece, player, white, black, game, move } =
    useContext(ChessContext);

  const { board } = game;
  const flip = player === "Black";

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
  const flip = player === "Black";
  const active = player === piece.owner.getColor();
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
      disabled={!active}>
      <Image
        source={lodash.get(
          images,
          `${piece.getType()}.${piece.isWhite ? "white" : "black"}`
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
                source={promotion.image[player || "White"]}
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
  const player = isWhite ? "White" : "Black";
  const opponent = isWhite ? "Black" : "White";

  const { game } = useContext(ChessContext);
  const [secondsRemaining, setSecondsRemaining] = useState(600);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const timer = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    const { activePlayer, lastMovedAt } = game;
    if (player === activePlayer && lastMovedAt[opponent] !== null) {
      // @ts-ignore
      console.log("mount", {
        player,
        activePlayer,
        lastMovedAt: lastMovedAt[opponent].toLocaleTimeString(),
      });
      timer.current = setInterval(() => {
        const elapsedTime = Date.now() - lastMovedAt[opponent].getTime();
        setElapsedSeconds(Math.floor(elapsedTime / 1000));
      }, 1000);
    }
    return () => {
      if (player === activePlayer && lastMovedAt[opponent] !== null) {
        console.log("unmount", {
          player,
          activePlayer,
          lastMovedAt: lastMovedAt[opponent].toLocaleTimeString(),
        });
        clearInterval(timer.current);
        const elapsedTime = Date.now() - lastMovedAt[opponent].getTime();
        setSecondsRemaining((s) => s - Math.floor(elapsedTime / 1000));
        setElapsedSeconds(0);
      }
    };
  }, [player, game]);

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
