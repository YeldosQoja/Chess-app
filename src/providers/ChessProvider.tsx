import {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useLocalSearchParams } from "expo-router";
import {
  Chess as Game,
  Board as BoardType,
  IPiece,
  PieceType,
  Player,
  Square,
  StrategyFactory,
  Move,
  Promotion,
} from "@/models";
import { useLazy } from "@/hooks/useLazy";
import { GameSocketService } from "@/services/SocketService";

type GameState = {
  activePlayer: "white" | "black";
  board: BoardType;
  moves: (Move | Promotion)[];
  isFinished: boolean;
};

export const ChessContext = createContext<{
  selectedPiece: IPiece | null;
  gameState: GameState;
  player: "white" | "black" | null;
  white: Player | null;
  black: Player | null;
  promotionPickerOpen: boolean;
  selectPiece: (piece: IPiece) => void;
  move: (square: Square) => void;
  selectPromotion: (pieceType: PieceType) => void;
  finish: (finishedAt: Date, winner?: "white" | "black") => void;
}>({
  selectedPiece: null,
  gameState: {
    activePlayer: "white",
    board: Array(8).fill(Array(8).fill(null)),
    moves: [],
    isFinished: false,
  },
  player: null,
  white: null,
  black: null,
  promotionPickerOpen: false,
  selectPiece: (piece: IPiece) => {},
  move: (square: Square) => {},
  selectPromotion: () => {},
  finish: () => {},
});

type Props = {
  player: "white" | "black" | null;
  onFinish: (finishedAt: Date, winner?: "white" | "black") => void;
};

export const ChessProvider = ({
  children,
  player,
  onFinish,
}: PropsWithChildren<Props>) => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const chess = useLazy(() => new Game());
  const strategyFactory = useLazy(() => new StrategyFactory(chess));
  const socketService = useLazy(
    () =>
      new GameSocketService(
        `${process.env.EXPO_PUBLIC_WS_URL}games/room-${id}/`,
      ),
  );

  const [gameState, setGameState] = useState<GameState>({
    activePlayer: "white",
    board: chess.board,
    moves: [],
    isFinished: false,
  });
  const [selectedPiece, setSelectedPiece] = useState<IPiece | null>(null);
  const [promotionPickerOpen, setPromotionPickerOpen] = useState(false);

  const move = useCallback(
    (data: Move) => {
      const { from, to, timestamp } = data;
      const [rank, file] = from;
      const piece = chess.board[rank][file] as IPiece;
      const color = piece.owner.getColor();
      chess.move(piece, to);

      if (piece.isPromotion() && player === color) {
        setPromotionPickerOpen(true);
      } else {
        setGameState((prev) => ({
          isFinished: chess.isInCheckmate() || chess.isInStalemate(),
          activePlayer: chess.activePlayer.getColor(),
          board: chess.board,
          moves: [...prev.moves, data],
        }));
        setSelectedPiece(null);
      }

      if (chess.isInCheckmate()) {
        onFinish(timestamp, color);
      } else if (chess.isInStalemate()) {
        onFinish(timestamp);
      }
    },
    [chess, onFinish, player],
  );

  const promote = useCallback(
    (data: Promotion) => {
      const { player, square, piece: pieceType, timestamp } = data;
      const [rank, file] = square;
      const piece = chess.board[rank][file] as IPiece;
      const strategy = strategyFactory.create(pieceType);
      chess.updateStrategy(piece, strategy);

      setGameState((prev) => ({
        isFinished: chess.isInCheckmate() || chess.isInStalemate(),
        activePlayer: chess.activePlayer.getColor(),
        board: chess.board,
        moves: [...prev.moves, data],
      }));
      setSelectedPiece(null);
      setPromotionPickerOpen(false);

      if (chess.isInCheckmate()) {
        onFinish(timestamp, player);
      } else if (chess.isInStalemate()) {
        onFinish(timestamp);
      }
    },
    [chess, onFinish, strategyFactory],
  );

  useEffect(() => {
    socketService.onMove((data) => {
      if (data.player !== player) {
        move(data);
      }
    });

    socketService.onPromotion((data) => {
      if (data.player !== player) {
        promote(data);
      }
    });

    socketService.onError((e) => {
      console.log("error", e);
    });

    return () => {
      socketService.close();
    };
  }, [player, move, promote, socketService]);

  const sendMove = useCallback(
    (square: Square) => {
      if (selectedPiece) {
        const { owner, currentSquare } = selectedPiece;
        const data: Move = {
          player: owner.getColor(),
          from: currentSquare,
          to: square,
          timestamp: new Date(),
        };
        move(data);
        socketService.sendMove(data);
      }
    },
    [move, selectedPiece, socketService],
  );

  const sendPromotion = useCallback(
    (pieceType: PieceType) => {
      if (selectedPiece) {
        const { owner, currentSquare } = selectedPiece;
        const data: Promotion = {
          player: owner.getColor(),
          square: currentSquare,
          piece: pieceType,
          timestamp: new Date(),
        };
        promote(data);
        socketService.sendPromotion(data);
      }
    },
    [promote, selectedPiece, socketService],
  );

  const handleSelectPiece = useCallback(
    (piece: IPiece) => {
      if (chess.activePlayer === piece.owner) {
        setSelectedPiece(piece);
      }
    },
    [chess.activePlayer],
  );

  const { white, black } = chess;

  return (
    <ChessContext.Provider
      value={{
        selectedPiece,
        gameState,
        player,
        white,
        black,
        promotionPickerOpen,
        selectPiece: handleSelectPiece,
        move: sendMove,
        selectPromotion: sendPromotion,
        finish: onFinish,
      }}
    >
      {children}
    </ChessContext.Provider>
  );
};
