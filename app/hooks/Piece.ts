import { Game } from "./Chess";
import { Player } from "./Player";

export enum PieceType {
  Pawn = "pawn",
  Rook = "rook",
  Knight = "knight",
  Bishop = "bishop",
  Queen = "queen",
  King = "king",
}

export type Board = Array<Array<Piece | null>>;

export type Square = [number, number];

const horizontalVerticalDirs: Array<Square> = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

const diagonalDirs: Array<Square> = [
  [-1, -1],
  [-1, 1],
  [1, 1],
  [1, -1],
];

const knightDirs: Array<Square> = [
  [-1, -2],
  [-2, -1],
  [-2, 1],
  [-1, 2],
  [1, 2],
  [2, 1],
  [2, -1],
  [1, -2],
];

export interface IPiece {
  readonly game: Game;
  readonly owner: Player;
  strategy: IStrategy;
  currentSquare: Square;
  readonly initialSquare: Square;
  getValidMoves(): Square[];
  move(square: Square): void;
}

export class Piece implements IPiece {
  readonly game: Game;
  readonly owner: Player;
  readonly initialSquare: Square;
  currentSquare: Square;
  strategy: IStrategy;
  isMoved = false;
  get isWhite(): boolean {
    return this.game.white === this.owner;
  }

  constructor(game: Game, owner: Player, square: Square, strategy: IStrategy) {
    this.game = game;
    this.owner = owner;
    this.initialSquare = this.currentSquare = square;
    this.strategy = strategy;
  }

  getValidMoves(): Array<Square> {
    return this.filterMoves(
      this.strategy.getValidMoves(this.currentSquare, this.isMoved, this.owner)
    );
  }

  private filterMoves(moves: Array<Square>): Array<Square> {
    const [curRank, curFile] = this.currentSquare;
    const king = this.owner.getKing();
    let res: Array<Square> = [];
    if (king.isInCheck()) {
      res = moves.filter((square) => {
        const [moveRank, moveFile] = square;
        const prevPiece = this.game.board[moveRank][moveFile];
        this.game.board[moveRank][moveFile] = this;
        const isInCheck = king.isInCheck();
        this.game.board[moveRank][moveFile] = prevPiece;
        return !isInCheck;
      });
    } else {
      res = moves.filter((square) => {
        const [moveRank, moveFile] = square;
        const prevPiece = this.game.board[moveRank][moveFile];
        this.game.board[moveRank][moveFile] = this;
        this.game.board[curRank][curFile] = null;
        const isInCheck = king.isInCheck();
        this.game.board[moveRank][moveFile] = prevPiece;
        this.game.board[curRank][curFile] = this;
        return !isInCheck;
      });
    }
    return res;
  }

  move(square: Square): void {
    this.isMoved = true;
    this.currentSquare = square;
  }
}

export class King extends Piece {
  getValidMoves(): Square[] {
    return this.strategy.getValidMoves(
      this.currentSquare,
      this.isMoved,
      this.owner
    );
  }

  move(square: Square): void {
    if (Math.abs(this.currentSquare[1] - square[1]) === 2) {
      if (square[1] === 6) {
        this.game.board[this.currentSquare[0]][7]?.move([
          this.currentSquare[0],
          5,
        ]);
      } else {
        this.game.board[this.currentSquare[0]][0]?.move([
          this.currentSquare[0],
          3,
        ]);
      }
    }
    super.move(square);
  }

  isInCheck(): boolean {
    return (this.strategy as KingStrategy).isInCheck(
      this.currentSquare,
      this.owner
    );
  }
}

export interface IStrategy {
  game: Game;
  type?: PieceType | undefined;
  getValidMoves(
    currentSquare: Square,
    isMoved: boolean,
    owner: Player
  ): Array<Square>;
}

class Strategy implements IStrategy {
  game: Game;
  type?: PieceType | undefined;
  constructor(game: Game) {
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
  constructor(game: Game) {
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
    const verticalOffsets: Array<Square> = [[rankOffset, 0]];
    if (!isMoved) {
      verticalOffsets.push([rankOffset * 2, 0]);
    }
    for (const offset of verticalOffsets) {
      const square: Square = [rank + offset[0], file + offset[1]];
      const piece = this.game.board[square[0]][square[1]];
      if (piece === null) {
        moves.push(square);
      } else {
        break;
      }
    }

    // Filter diagonal offsets
    const diagonalOffsets: Array<Square> = [
      [rankOffset, -1],
      [rankOffset, 1],
    ];
    for (const offset of diagonalOffsets) {
      const square: Square = [rank + offset[0], file + offset[1]];
      const piece = this.isValidSquare(square)
        ? this.game.board[square[0]][square[1]]
        : null;
      if (piece && piece.owner !== owner) {
        moves.push(square);
      }
    }

    return moves;
  }
}

export class RookStrategy extends Strategy {
  constructor(game: Game) {
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
    for (const offset of horizontalVerticalDirs) {
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
  constructor(game: Game) {
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
    for (const offset of diagonalDirs) {
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
  constructor(game: Game) {
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
    knightDirs.forEach(([dr, dc]) => {
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
  constructor(game: Game) {
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
    for (const offset of horizontalVerticalDirs.concat(diagonalDirs)) {
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
  constructor(game: Game) {
    super(game);
    this.type = PieceType.King;
  }

  private getAvailableMoves(
    currentSquare: Square,
    owner: Player
  ): Array<Square> {
    const [rank, file] = currentSquare;
    const moves: Square[] = [];
    for (const [dr, df] of horizontalVerticalDirs.concat(diagonalDirs)) {
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
    for (const offset of horizontalVerticalDirs) {
      const square: Square = [rank + offset[0], file + offset[1]];
      while (this.isValidSquare(square)) {
        const piece = this.game.board[square[0]][square[1]];
        if (piece === null) {
          square[0] += offset[0];
          square[1] += offset[1];
        } else if (
          piece.owner !== owner &&
          (piece.strategy.type === PieceType.Rook ||
            piece.strategy.type === PieceType.Queen)
        ) {
          return true;
        } else {
          break;
        }
      }
    }

    for (const offset of diagonalDirs) {
      const square: Square = [rank + offset[0], file + offset[1]];
      while (this.isValidSquare(square)) {
        const piece = this.game.board[square[0]][square[1]];
        if (piece === null) {
          square[0] += offset[0];
          square[1] += offset[1];
        } else if (
          piece.owner !== owner &&
          (piece.strategy.type === PieceType.Bishop ||
            piece.strategy.type === PieceType.Queen)
        ) {
          return true;
        } else {
          break;
        }
      }
    }

    for (const offset of knightDirs) {
      const square: Square = [rank + offset[0], file + offset[1]];
      const piece = this.isValidSquare(square)
        ? this.game.board[square[0]][square[1]]
        : null;
      if (
        piece &&
        piece.owner !== owner &&
        piece.strategy.type === PieceType.Knight
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
      maybeRook.strategy.type !== PieceType.Rook ||
      maybeRook.isMoved
    ) {
      console.log(isMoved, maybeRook?.strategy.type, maybeRook?.isMoved);
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
      maybeRook.strategy.type !== PieceType.Rook ||
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
