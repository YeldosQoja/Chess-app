import React, {
  createRef,
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Chess,
  ChessPiecePromotionPicker,
  ChessPieceRef,
  GameResultModal,
} from "@/components";
import { useAppTheme } from "@/providers";
import {
  useFinishGame,
  useGetGameById,
  useMakeMove,
  useValidateMove,
  useValidMoves,
} from "@/queries/games";
import { GameSocketService } from "@/services/SocketService";
import { useLazy } from "@/hooks/useLazy";
import { Piece, PieceType, Square } from "@/models";
import { isSameSquare } from "@/utils/isSameSquare";
import { encodeSquare } from "@/utils/encodeSquare";
import { generatePieceListFromFEN } from "@/utils/generatePieceListFromFEN";
import { Move } from "@/models/Move";

const usePromotionDialog = () => {
  const [dialog, setDialog] = useState<{
    open: boolean;
    onSelect: (_: PieceType) => void;
  }>({
    open: false,
    onSelect: () => {},
  });

  const show = useCallback(
    ({ onSelect }: { onSelect: (_: PieceType) => void }) => {
      setDialog({ open: true, onSelect });
    },
    [setDialog],
  );

  return { open: dialog.open, onSelect: dialog.onSelect, show };
};

export default function Game() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const { data: game, isSuccess: isSuccessGame } = useGetGameById(id as string);
  const { data: validMoves } = useValidMoves(
    id as string,
    selectedSquare ? encodeSquare(selectedSquare) : null,
  );
  const validateMove = useValidateMove();
  const makeMove = useMakeMove();
  const finishGame = useFinishGame();
  const socketService = useLazy(
    () =>
      new GameSocketService(
        `${process.env.EXPO_PUBLIC_WS_URL}games/room-${id}/`,
      ),
  );

  const [resultModalOpen, setResultModalOpen] = useState(false);
  const {
    open: dialogOpen,
    onSelect,
    show: showPromotionDialog,
  } = usePromotionDialog();
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [turn, setTurn] = useState<string>("white");

  const pieceRefs: MutableRefObject<
    Record<string, MutableRefObject<ChessPieceRef>>
  > = useRef(
    useMemo(() => {
      let acc = {};
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          const square = encodeSquare([i, j]);
          acc = { ...acc, [square]: createRef() };
        }
      }
      return acc;
    }, []),
  );

  useEffect(() => {
    if (game) {
      setPieces(generatePieceListFromFEN(game.board));
      setTurn(game.turn);
    }
  }, [game]);

  const isEnPassant = useCallback(
    (move: Move) => {
      const { from, to } = move;
      const piece = pieces.find((p) => isSameSquare(p.square, from));
      const enemyPiece = pieces.find((p) => isSameSquare(p.square, to));
      return piece?.type === PieceType.Pawn && !enemyPiece && from[1] !== to[1];
    },
    [pieces],
  );

  const isCastling = useCallback(
    (move: Move) => {
      const { from, to } = move;
      const piece = pieces.find((p) => isSameSquare(p.square, from));
      return piece?.type === PieceType.King && Math.abs(from[1] - to[1]) === 2;
    },
    [pieces],
  );

  const isPromotion = useCallback(
    ({ from, to }: Move) => {
      const piece = pieces.find((p) => isSameSquare(p.square, from));
      if (!piece) {
        return false;
      }
      return (
        piece.type === PieceType.Pawn &&
        ((piece.color === "white" && piece.square[0] === 0) ||
          (piece.color === "black" && piece.square[0] === 7))
      );
    },
    [pieces],
  );

  const handleMove = useCallback(
    (move: Move, promotion?: PieceType) => {
      const { from, to } = move;
      if (isEnPassant(move)) {
        const square: Square = [from[0], to[1]];
        setPieces((prevPieces) =>
          prevPieces.filter((p) => isSameSquare(p.square, square)),
        );
      }
      if (isCastling(move)) {
        const j = from[1] < to[1] ? 7 : 0;
        const rookMove: Move = {
          from: [from[0], j],
          to: [from[0], j === 0 ? j + 3 : j - 2],
        };
        pieceRefs.current[encodeSquare(rookMove.from)].current.moveTo(
          rookMove.to,
        );
        handleMove(move);
      }
      setPieces((prevPieces) =>
        prevPieces
          .filter((p) => !isSameSquare(p.square, to))
          .map((p) => {
            if (!isSameSquare(p.square, from)) {
              return p;
            }
            return { ...p, square: to, promotion };
          }),
      );
    },
    [isCastling, isEnPassant],
  );

  useEffect(() => {
    socketService.onMove(({ from, to, promotion }) => {
      const square = encodeSquare(from);
      pieceRefs.current[square]?.current?.moveTo(to);
      handleMove({ from, to }, promotion);
    });
    return socketService.close;
  }, [socketService, handleMove]);

  const onMove = async (move: Move) => {
    try {
      const { is_valid: isValid } = await validateMove.mutateAsync({
        id: id as string,
        ...move,
      });
      if (isValid) {
        if (isPromotion(move)) {
          showPromotionDialog({
            onSelect: (promotion) => {
              makeMove.mutate({
                id: id as string,
                ...move,
                promotion,
                timestamp: new Date(),
              });
              handleMove(move, promotion);
            },
          });
        } else {
          makeMove.mutate({
            id: id as string,
            ...move,
            timestamp: new Date(),
          });
          handleMove(move);
        }
      }
      return isValid;
    } catch (err) {
      console.log("Error while making move", err);
      return false;
    }
  };

  const handleCloseResultModal = useCallback(() => {
    router.back();
    setResultModalOpen(false);
  }, [router]);

  if (!isSuccessGame) {
    return null;
  }

  const { white, black, color, winner } = game;

  // const whitePlayerCard = (
  //   <ChessPlayerCard
  //     color={color}
  //     time={600}
  //     firstName={white.firstName}
  //     lastName={white.lastName}
  //     avatar={white.avatar}
  //   />
  // );

  // const blackPlayerCard = (
  //   <ChessPlayerCard
  //     color={color}
  //     time={600}
  //     firstName={black.firstName}
  //     lastName={black.lastName}
  //     avatar={black.avatar}
  //   />
  // );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* {color === "white" ? blackPlayerCard : whitePlayerCard} */}
      <Chess
        color={color}
        pieces={pieces}
        pieceRefs={pieceRefs}
        onMove={onMove}
      />
      {/* {color === "white" ? whitePlayerCard : blackPlayerCard} */}
      <ChessPiecePromotionPicker
        open={dialogOpen}
        color={color}
        onSelectPromotion={onSelect}
      />
      <GameResultModal
        visible={resultModalOpen}
        isWinner={winner === color}
        color={color}
        winner={winner}
        white={white}
        black={black}
        onClose={handleCloseResultModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
