import { Board } from "./Board";
import { IPiece, Piece, King } from "./Piece";
import {
  QueenStrategy,
  RookStrategy,
  KingStrategy,
  KnightStrategy,
  PawnStrategy,
  BishopStrategy,
  IStrategy,
} from "./Strategy";
import { Player } from "./Player";
import { includesSquare } from "@/utils/isSameSquare";

export interface IChess {
  board: Board;
  readonly white: Player;
  readonly black: Player;
  activePlayer: Player;
  currentEnPassantPawn: IPiece | null;
  move(piece: IPiece, square: [number, number]): void;
  updateStrategy(piece: IPiece, strategy: IStrategy): void
  isInCheck(): boolean;
  isInCheckmate(): boolean;
  isInStalemate(): boolean;
}

export class Chess implements IChess {
  board: Board = [];
  readonly white: Player;
  readonly black: Player;
  activePlayer: Player;
  currentEnPassantPawn: IPiece | null = null;

  constructor() {
    this.white = new Player(this);
    this.black = new Player(this);
    this.initBoard();
    this.createPieces(this.white);
    this.createPieces(this.black);
    this.updateBoard();
    this.activePlayer = this.white;
  }

  private createPieces(player: Player): void {
    const pawnsRank = player === this.white ? 6 : 1;
    const piecesRank = player === this.white ? 7 : 0;

    const pawnStrategy = new PawnStrategy(this);
    const rookStrategy = new RookStrategy(this);
    const bishopStrategy = new BishopStrategy(this);
    const knightStrategy = new KnightStrategy(this);
    const queenStrategy = new QueenStrategy(this);
    const kingStrategy = new KingStrategy(this);
    for (let file = 0; file < 8; file++) {
      player.pieces.push(
        new Piece(this, player, [pawnsRank, file], pawnStrategy)
      );
    }
    player.pieces.push(
      new Piece(this, player, [piecesRank, 0], rookStrategy),
      new Piece(this, player, [piecesRank, 1], knightStrategy),
      new Piece(this, player, [piecesRank, 2], bishopStrategy),
      new Piece(this, player, [piecesRank, 3], queenStrategy),
      new King(this, player, [piecesRank, 4], kingStrategy),
      new Piece(this, player, [piecesRank, 5], bishopStrategy),
      new Piece(this, player, [piecesRank, 6], knightStrategy),
      new Piece(this, player, [piecesRank, 7], rookStrategy)
    );
  }

  private initBoard() {
    for (let i = 0; i < 8; i++) {
      this.board.push(new Array(8));
      for (let j = 0; j < 8; j++) {
        this.board[i][j] = null;
      }
    }
  }

  private updateBoard(): void {
    this.resetBoard();
    for (const p of this.white.pieces.filter((p) => !p.isCaptured)) {
      const [rank, file] = p.currentSquare;
      this.board[rank][file] = p;
    }
    for (const p of this.black.pieces.filter((p) => !p.isCaptured)) {
      const [rank, file] = p.currentSquare;
      this.board[rank][file] = p;
    }
  }

  private resetBoard(): void {
    this.board = [];
    for (let rank = 0; rank < 8; rank++) {
      this.board[rank] = new Array(8);
      for (let file = 0; file < 8; file++) {
        this.board[rank][file] = null;
      }
    }
  }

  move(piece: IPiece, square: [number, number]): void {
    if (
      piece.owner === this.activePlayer &&
      includesSquare(piece.getValidMoves(), square)
    ) {
      // Remove current en passant pawn
      this.currentEnPassantPawn = null;
      // Make move
      piece.move(square);
      // Switch player
      this.activePlayer = this.activePlayer.getOpponent();
      // Update the board
      this.updateBoard();
    }
  }

  updateStrategy(piece: IPiece, strategy: IStrategy): void {
    piece.updateStrategy(strategy);
    this.updateBoard();
  }

  isInCheck(): boolean {
    const kingPiece = this.activePlayer.getKing();
    return kingPiece.isInCheck();
  }

  isInCheckmate(): boolean {
    return this.isInCheck() && this.isInStalemate();
  }

  isInStalemate(): boolean {
    if (this.isInCheck()) {
      return false;
    }
    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        const piece = this.board[rank][file];
        if (
          piece &&
          piece.owner === this.activePlayer &&
          piece.getValidMoves().length > 0
        ) {
          return false;
        }
      }
    }
    return true;
  }
}
