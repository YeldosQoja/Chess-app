import {
  createContext,
  createRef,
  forwardRef,
  MutableRefObject,
  PropsWithChildren,
  useCallback,
  useContext,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Move, Piece, PieceType, Square } from "@/models";
import { encodeSquare } from "@/utils/encodeSquare";
import { isSameSquare } from "@/utils/isSameSquare";
import { ChessPieceRef } from "@/components";
import { generatePieceListFromFEN } from "@/utils/generatePieceListFromFEN";
import { usePromotionPicker } from "./promotion-picker";

export const ChessContext = createContext<{
  color: "white" | "black";
  pieces: Piece[];
  turn: "white" | "black";
  onMove: (_: Move) => Promise<boolean>;
  pieceRefs: MutableRefObject<
    Record<string, MutableRefObject<ChessPieceRef>>
  > | null;
}>({
  color: "white",
  pieces: [],
  turn: "white",
  onMove: () => Promise.resolve(true),
  pieceRefs: null,
});

export const useChess = () => {
  const value = useContext(ChessContext);
  return value;
};

type Props = {
  color: "white" | "black";
  board: string;
  turn: "white" | "black";
  onSelect?: () => {};
  onMove: (_: Move) => void;
  validateMove: (_: Move) => boolean | Promise<boolean>;
};

export type ChessRef = {
  move: (_: Move, promotion: PieceType) => void;
};

// eslint-disable-next-line react/display-name
export const ChessProvider = forwardRef<ChessRef, PropsWithChildren<Props>>(
  ({ color, board, turn, onSelect, onMove, validateMove, children }, ref) => {
    const [pieces, setPieces] = useState<Piece[]>(
      generatePieceListFromFEN(board),
    );
    const [nextTurn, setNextTurn] = useState(turn);
    const { show: showPromotionPicker } = usePromotionPicker();

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

    const isEnPassant = useCallback(
      (move: Move) => {
        const { from, to } = move;
        const piece = pieces.find((p) => isSameSquare(p.square, from));
        const enemyPiece = pieces.find((p) => isSameSquare(p.square, to));
        return (
          piece?.type === PieceType.Pawn && !enemyPiece && from[1] !== to[1]
        );
      },
      [pieces],
    );

    const isCastling = useCallback(
      (move: Move) => {
        const { from, to } = move;
        const piece = pieces.find((p) => isSameSquare(p.square, from));
        return (
          piece?.type === PieceType.King && Math.abs(from[1] - to[1]) === 2
        );
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

    const switchTurn = useCallback(() => {
      setNextTurn((prevTurn) => (prevTurn === "white" ? "black" : "white"));
    }, []);

    const makeMove = useCallback(
      (move: Move, promotion?: PieceType) => {
        const { from, to } = move;
        if (isEnPassant(move)) {
          const square: Square = [from[0], to[1]];
          setPieces((prevPieces) =>
            prevPieces.filter((p) => !isSameSquare(p.square, square)),
          );
        }
        if (isCastling(move)) {
          const j = from[1] < to[1] ? 7 : 0;
          const rookMove: Move = {
            from: [from[0], j],
            to: [from[0], j === 0 ? j + 3 : j - 2],
          };
          const rookSquare = encodeSquare(rookMove.from);
          pieceRefs.current[rookSquare].current.moveTo(rookMove.to);
          makeMove(rookMove);
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

    useImperativeHandle(ref, () => ({
      move(move, promotion) {
        const square = encodeSquare(move.from);
        pieceRefs.current[square].current.moveTo(move.to);
        makeMove(move, promotion);
      },
    }));

    const handleMove = useCallback(
      async (move: Move) => {
        try {
          const isValid = await validateMove(move);
          if (isValid) {
            if (isPromotion(move)) {
              showPromotionPicker({
                onSelect: (promotion) => {
                  onMove(move);
                  makeMove(move, promotion);
                  switchTurn();
                },
              });
            } else {
              onMove(move);
              makeMove(move);
              switchTurn();
            }
          }
          return isValid;
        } catch (err) {
          console.log("Error while making move", err);
          return false;
        }
      },
      [
        isPromotion,
        makeMove,
        onMove,
        showPromotionPicker,
        switchTurn,
        validateMove,
      ],
    );

    return (
      <ChessContext.Provider
        value={{
          color,
          pieces,
          turn: nextTurn,
          onMove: handleMove,
          pieceRefs,
        }}
      >
        {children}
      </ChessContext.Provider>
    );
  },
);
