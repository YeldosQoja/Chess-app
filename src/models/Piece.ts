import { IChess } from "./Chess";
import { PieceType } from "./PieceType";
import { Player } from "./Player";
import { IStrategy, KingStrategy } from "./Strategy";
import { Square } from "./Square";

export interface IPiece {
  id: string;
  isCaptured: boolean;
  readonly game: IChess;
  readonly owner: Player;
  strategy: IStrategy;
  currentSquare: Square;
  readonly initialSquare: Square;
  isMoved: boolean;
  get isWhite(): boolean;
  getValidMoves(): Square[];
  move(square: Square): void;
  getType(): PieceType;
  updateStrategy(strategy: IStrategy): void;
  isPromotion(): boolean;
}

export class Piece implements IPiece {
  id: string;
  isCaptured: boolean = false;
  readonly game: IChess;
  readonly owner: Player;
  readonly initialSquare: Square;
  currentSquare: Square;
  strategy: IStrategy;
  isMoved = false;
  get isWhite(): boolean {
    return this.game.white === this.owner;
  }

  constructor(
    game: IChess,
    owner: Player,
    square: Square,
    strategy: IStrategy
  ) {
    this.id = "" + strategy.type + square[0] + square[1];
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

  getType(): PieceType {
    return this.strategy.type as PieceType;
  }

  updateStrategy(strategy: IStrategy): void {
    this.strategy = strategy;
    this.isMoved = false;
  }

  move(square: Square): void {
    const [moveRank, moveFile] = square;
    if (this.getType() === PieceType.Pawn) {
      if (!this.isMoved && Math.abs(square[0] - this.initialSquare[0]) === 2) {
        this.game.currentEnPassantPawn = this;
      }
      const [curRank, curFile] = this.currentSquare;
      // Check If move is En Passant
      const piece = this.game.board[moveRank][moveFile];
      if (piece === null && moveFile !== curFile) {
        (this.game.board[curRank][moveFile] as IPiece).isCaptured = true;
      }
    }
    this.isMoved = true;
    this.currentSquare = square;
    // Delete piece that are previously in square activePlayer moved to
    const prevPiece = this.game.board[moveRank][moveFile];
    if (prevPiece) {
      prevPiece.isCaptured = true;
    }
  }

  isPromotion(): boolean {
    return this.strategy.isPromotion(this.currentSquare, this.owner);
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
