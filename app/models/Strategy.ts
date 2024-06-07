import { IGame } from "./Game";
import { Pawn } from "./Piece";
import { PieceType } from "./PieceType";
import { Player } from "./Player";
import { Square } from "./Square";

const HORIZONTAL_VERTICAL_OFFSETS: Array<Square> = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

const DIAGONAL_OFFSETS: Array<Square> = [
  [-1, -1],
  [-1, 1],
  [1, 1],
  [1, -1],
];

const KNIGHT_OFFSETS: Array<Square> = [
  [-1, -2],
  [-2, -1],
  [-2, 1],
  [-1, 2],
  [1, 2],
  [2, 1],
  [2, -1],
  [1, -2],
];

export interface IStrategy {
  game: IGame;
  type?: PieceType | undefined;
  getValidMoves(
    currentSquare: Square,
    isMoved: boolean,
    owner: Player
  ): Array<Square>;
  isValidSquare(square: Square): boolean;
}

class Strategy implements IStrategy {
  game: IGame;
  type?: PieceType | undefined;
  constructor(game: IGame) {
    this.game = game;
  }

  getValidMoves(
    currentSquare: Square,
    isMoved: boolean,
    owner: Player
  ): Array<Square> {
    return [];
  }

  isValidSquare(square: Square): boolean {
    const [rank, file] = square;
    return 0 <= rank && rank < 8 && 0 <= file && file < 8;
  }
}

export class PawnStrategy extends Strategy {
  constructor(game: IGame) {
    super(game);
    this.type = PieceType.Pawn;
  }

  getValidMoves(
    currentSquare: Square,
    isMoved: boolean,
    owner: Player
  ): Square[] {
    const [rank, file] = currentSquare;
    const moves: Square[] = [];

    const rankOffset = this.game.white === owner ? -1 : 1;
    // Filter valid vertical offsets
    let offsets: Array<Square> = [[rankOffset, 0]];
    if (!isMoved) {
      offsets.push([rankOffset * 2, 0]);
    }
    for (const offset of offsets) {
      const square: Square = [rank + offset[0], file + offset[1]];
      if (!this.isValidSquare(square)) {
        continue;
      }
      const piece = this.game.board[square[0]][square[1]];
      console.log(square, piece);
      if (piece === null) {
        moves.push(square);
      } else {
        break;
      }
    }

    // Filter diagonal offsets
    offsets = [
      [rankOffset, -1],
      [rankOffset, 1],
    ];
    for (const offset of offsets) {
      const square: Square = [rank + offset[0], file + offset[1]];
      const piece = this.isValidSquare(square)
        ? this.game.board[square[0]][square[1]]
        : null;
      if (piece && piece.owner !== owner) {
        moves.push(square);
      }
    }

    offsets = [
      [0, -1],
      [0, 1],
    ];
    for (const offset of offsets) {
      const square: Square = [rank + offset[0], file + offset[1]];
      const piece = this.isValidSquare(square)
        ? this.game.board[square[0]][square[1]]
        : null;
      if (
        piece &&
        piece.getType() === PieceType.Pawn &&
        piece.owner !== owner &&
        piece === this.game.currentEnPassantPawn
      ) {
        moves.push([rank + rankOffset, file + offset[1]]);
      }
    }

    return moves;
  }
}

export class RookStrategy extends Strategy {
  constructor(game: IGame) {
    super(game);
    this.type = PieceType.Rook;
  }

  getValidMoves(
    currentSquare: Square,
    isMoved: boolean,
    owner: Player
  ): Array<Square> {
    const [rank, file] = currentSquare;
    const moves: Square[] = [];
    for (const offset of HORIZONTAL_VERTICAL_OFFSETS) {
      let [moveRank, moveFile] = [rank + offset[0], file + offset[1]];
      while (this.isValidSquare([moveRank, moveFile])) {
        const piece = this.game.board[moveRank][moveFile];
        if (piece) {
          if (piece.owner !== owner) {
            moves.push([moveRank, moveFile]);
          }
          break;
        } else {
          moves.push([moveRank, moveFile]);
          moveRank += offset[0];
          moveFile += offset[1];
        }
      }
    }
    return moves;
  }
}

export class BishopStrategy extends Strategy {
  constructor(game: IGame) {
    super(game);
    this.type = PieceType.Bishop;
  }

  getValidMoves(
    currentSquare: Square,
    isMoved: boolean,
    owner: Player
  ): Array<Square> {
    const [rank, file] = currentSquare;
    const moves: Square[] = [];
    for (const offset of DIAGONAL_OFFSETS) {
      let [moveRank, moveFile] = [rank + offset[0], file + offset[1]];
      while (this.isValidSquare([moveRank, moveFile])) {
        const piece = this.game.board[moveRank][moveFile];
        if (piece) {
          if (piece.owner !== owner) {
            moves.push([moveRank, moveFile]);
          }
          break;
        } else {
          moves.push([moveRank, moveFile]);
          moveRank += offset[0];
          moveFile += offset[1];
        }
      }
    }
    return moves;
  }
}

export class KnightStrategy extends Strategy {
  constructor(game: IGame) {
    super(game);
    this.type = PieceType.Knight;
  }

  getValidMoves(
    currentSquare: Square,
    isMoved: boolean,
    owner: Player
  ): Array<Square> {
    const [rank, file] = currentSquare;
    const moves: Square[] = [];
    KNIGHT_OFFSETS.forEach(([dr, dc]) => {
      const curSquare: Square = [rank + dr, file + dc];
      if (!this.isValidSquare(curSquare)) {
        return;
      }
      const piece = this.game.board[curSquare[0]][curSquare[1]];
      if (piece === null || piece.owner !== owner) {
        moves.push(curSquare);
      }
    });
    return moves;
  }
}

export class QueenStrategy extends Strategy {
  constructor(game: IGame) {
    super(game);
    this.type = PieceType.Queen;
  }

  getValidMoves(
    currentSquare: Square,
    isMoved: boolean,
    owner: Player
  ): Array<Square> {
    const [curRank, curFile] = currentSquare;
    const moves: Square[] = [];
    for (const offset of HORIZONTAL_VERTICAL_OFFSETS.concat(DIAGONAL_OFFSETS)) {
      let [moveRank, moveFile] = [curRank + offset[0], curFile + offset[1]];
      while (this.isValidSquare([moveRank, moveFile])) {
        const piece = this.game.board[moveRank][moveFile];
        if (piece) {
          if (piece.owner !== owner) {
            moves.push([moveRank, moveFile]);
          }
          break;
        } else {
          moves.push([moveRank, moveFile]);
          moveRank += offset[0];
          moveFile += offset[1];
        }
      }
    }
    return moves;
  }
}

export class KingStrategy extends Strategy {
  constructor(game: IGame) {
    super(game);
    this.type = PieceType.King;
  }

  private getAvailableMoves(
    currentSquare: Square,
    owner: Player
  ): Array<Square> {
    const [rank, file] = currentSquare;
    const moves: Square[] = [];
    for (const [dr, df] of HORIZONTAL_VERTICAL_OFFSETS.concat(
      DIAGONAL_OFFSETS
    )) {
      const curSquare: Square = [rank + dr, file + df];
      if (!this.isValidSquare(curSquare)) {
        continue;
      }
      const piece = this.game.board[curSquare[0]][curSquare[1]];
      if (piece === null || piece.owner !== owner) {
        moves.push(curSquare);
      }
    }
    return moves;
  }

  getValidMoves(
    currentSquare: Square,
    isMoved: boolean,
    owner: Player
  ): Array<Square> {
    const [curRank, curFile] = currentSquare;
    const king = this.game.board[curRank][curFile];
    this.game.board[curRank][curFile] = null;
    const validMoves: Array<Square> = this.getAvailableMoves(
      currentSquare,
      owner
    ).filter((square) => {
      return !this.isInCheck(square, owner);
    });

    if (this.isKingSideCastleValid(currentSquare, isMoved, owner)) {
      validMoves.push([currentSquare[0], 6]);
    }

    if (this.isQueenSideCastleValid(currentSquare, isMoved, owner)) {
      validMoves.push([currentSquare[0], 2]);
    }

    this.game.board[curRank][curFile] = king;
    return validMoves;
  }

  isInCheck(square: Square, owner: Player): boolean {
    const [rank, file] = square;
    const rankOffset = owner === this.game.white ? -1 : 1;

    let [pawnRank, pawnFile] = [rank + rankOffset, file - 1];
    let maybePawn = this.isValidSquare([pawnRank, pawnFile])
      ? this.game.board[pawnRank][pawnFile]
      : null;
    if (
      maybePawn &&
      maybePawn.owner !== owner &&
      maybePawn.getType() === PieceType.Pawn
    ) {
      return true;
    }

    [pawnRank, pawnFile] = [rank + rankOffset, file + 1];
    maybePawn = this.isValidSquare([pawnRank, pawnFile])
      ? this.game.board[pawnRank][pawnFile]
      : null;
    if (
      maybePawn &&
      maybePawn.owner !== owner &&
      maybePawn.getType() === PieceType.Pawn
    ) {
      return true;
    }

    for (const offset of HORIZONTAL_VERTICAL_OFFSETS) {
      const square: Square = [rank + offset[0], file + offset[1]];
      while (this.isValidSquare(square)) {
        const piece = this.game.board[square[0]][square[1]];
        if (piece === null) {
          square[0] += offset[0];
          square[1] += offset[1];
        } else if (
          piece.owner !== owner &&
          (piece.getType() === PieceType.Rook ||
            piece.getType() === PieceType.Queen)
        ) {
          return true;
        } else {
          break;
        }
      }
    }

    for (const offset of DIAGONAL_OFFSETS) {
      const square: Square = [rank + offset[0], file + offset[1]];
      while (this.isValidSquare(square)) {
        const piece = this.game.board[square[0]][square[1]];
        if (piece === null) {
          square[0] += offset[0];
          square[1] += offset[1];
        } else if (
          piece.owner !== owner &&
          (piece.getType() === PieceType.Bishop ||
            piece.getType() === PieceType.Queen)
        ) {
          return true;
        } else {
          break;
        }
      }
    }

    for (const offset of KNIGHT_OFFSETS) {
      const square: Square = [rank + offset[0], file + offset[1]];
      const piece = this.isValidSquare(square)
        ? this.game.board[square[0]][square[1]]
        : null;
      if (
        piece &&
        piece.owner !== owner &&
        piece.getType() === PieceType.Knight
      ) {
        return true;
      }
    }

    for (const offset of HORIZONTAL_VERTICAL_OFFSETS.concat(DIAGONAL_OFFSETS)) {
      const square: Square = [rank + offset[0], file + offset[1]];
      const piece = this.isValidSquare(square)
        ? this.game.board[square[0]][square[1]]
        : null;
      if (
        piece &&
        piece.owner !== owner &&
        piece.getType() === PieceType.King
      ) {
        return true;
      }
    }

    return false;
  }

  private isKingSideCastleValid(
    currentSquare: Square,
    isMoved: boolean,
    owner: Player
  ): boolean {
    const maybeRook = this.game.board[currentSquare[0]][7];
    if (
      isMoved ||
      maybeRook === null ||
      maybeRook.getType() !== PieceType.Rook ||
      maybeRook.isMoved
    ) {
      return false;
    }
    for (let file = currentSquare[1]; file < 7; file++) {
      const square: Square = [currentSquare[0], file];
      if (this.isInCheck(square, owner)) {
        return false;
      }
    }
    return true;
  }

  private isQueenSideCastleValid(
    currentSquare: Square,
    isMoved: boolean,
    owner: Player
  ): boolean {
    const maybeRook = this.game.board[currentSquare[0]][0];
    if (
      isMoved ||
      maybeRook === null ||
      maybeRook.getType() !== PieceType.Rook ||
      maybeRook.isMoved
    ) {
      return false;
    }
    for (let file = currentSquare[1]; file > 1; file--) {
      const square: Square = [currentSquare[0], file];
      if (this.isInCheck(square, owner)) {
        return false;
      }
    }
    return true;
  }
}
