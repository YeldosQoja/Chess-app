import { View, StyleSheet, TouchableOpacity, Modal } from "react-native";
import React, { useState } from "react";
import { Colors } from "../constants/Colors";
import { IGame } from "../hooks/Chess";
import { ChessPiece } from "./ChessPiece";
import { IPiece, IStrategy, PieceType } from "../hooks/Piece";
import { PromotionPicker } from "./PromotionPicker";

export const Chessboard = ({ game }: { game: IGame }) => {
  const { board, white, black } = game;
  const [selectedPiece, setSelectedPiece] = useState<IPiece | null>(null);
  const validMoves = selectedPiece ? selectedPiece.getValidMoves() : [];
  const [promotionModalOpen, setPromotionModalOpen] = useState(false);

  const handleSelectSquare = (square: [number, number]) => {
    const [rank, file] = square;
    const piece = board[rank][file];
    if (selectedPiece === null && piece === null) {
      return;
    }
    if (piece && game.canSelect(piece)) {
      setSelectedPiece(piece);
      game.selectPiece(piece);
    } else if (
      selectedPiece &&
      selectedPiece
        .getValidMoves()
        .some(([moveRank, moveFile]) => moveRank === rank && moveFile === file)
    ) {
      game.move(square);
      if (
        selectedPiece.getType() === PieceType.Pawn &&
        (rank === 0 || rank === 7)
      ) {
        setPromotionModalOpen(true);
      } else {
        setSelectedPiece(null);
      }
    }
  };

  const handleSelectPromotion = ({ strategy }: { strategy: IStrategy }) => {
    selectedPiece?.updateStrategy(strategy);
    setSelectedPiece(null);
    setPromotionModalOpen(false);
  };

  return (
    <View style={styles.board}>
      {board.map((row, rank) => {
        const isEvenRank = rank % 2 === 0;
        const colors = [
          isEvenRank ? Colors.chessboard.light : Colors.chessboard.dark,
          isEvenRank ? Colors.chessboard.dark : Colors.chessboard.light,
        ];
        return (
          <View
            key={rank}
            style={styles.row}>
            {row.map((_, file) => {
              const isValid = validMoves.some(
                (s) => s[0] === rank && s[1] === file
              );
              return (
                <TouchableOpacity
                  activeOpacity={0.9}
                  key={file}
                  style={[
                    styles.square,
                    {
                      backgroundColor: colors[file % 2],
                    },
                  ]}
                  onPress={() => void handleSelectSquare([rank, file])}>
                  {isValid && <View style={styles.dot} />}
                </TouchableOpacity>
              );
            })}
          </View>
        );
      })}
      {white.pieces.map((piece) => (
        <ChessPiece
          key={piece.id}
          piece={piece}
          selected={selectedPiece === piece}
          onSelect={handleSelectSquare}
        />
      ))}
      {black.pieces.map((piece) => (
        <ChessPiece
          key={piece.id}
          piece={piece}
          selected={selectedPiece === piece}
          onSelect={handleSelectSquare}
        />
      ))}
      <PromotionPicker
        open={promotionModalOpen}
        game={game}
        isWhite={selectedPiece?.owner === game.white}
        onSelect={handleSelectPromotion}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    width: "100%",
    aspectRatio: 1,
  },
  row: {
    width: "100%",
    flexDirection: "row",
  },
  square: {
    width: `${100 / 8}%`,
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
