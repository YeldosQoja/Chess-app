import { Board } from "./Board";
import { IPiece, Piece, King, Pawn } from "./Piece";
import {
  QueenStrategy,
  RookStrategy,
  KingStrategy,
  KnightStrategy,
  PawnStrategy,
  BishopStrategy,
} from "./Strategy";
import { Player } from "./Player";

export interface IGame {
  readonly board: Board;
  readonly white: Player;
  readonly black: Player;
  currentEnPassantPawn: Pawn | null;
  updateBoard(): void;
  resetBoard(): void;
  selectPiece(piece: IPiece): void;
  canSelect(piece: IPiece): boolean;
  move(square: [number, number]): void;
  isInCheck(): boolean;
  isInCheckmate(): boolean;
  isInStalemate(): boolean;
  getWinner(): string;
  getActivePlayer(): string;
}

export class Game implements IGame {
  readonly board: Board;
  readonly white: Player;
  readonly black: Player;
  currentEnPassantPawn: Pawn | null = null;

  private activePlayer: Player;
  private selectedPiece: IPiece | null = null;

  constructor() {
    this.white = new Player(this);
    this.black = new Player(this);
    this.board = [];
    for (let i = 0; i < 8; i++) {
      this.board.push(new Array(8));
      for (let j = 0; j < 8; j++) {
        this.board[i][j] = null;
      }
    }
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
        new Pawn(this, player, [pawnsRank, file], pawnStrategy)
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

  updateBoard(): void {
    this.resetBoard();
    for (const p of this.white.pieces.filter(p => !p.isCaptured)) {
      const [rank, file] = p.currentSquare;
      this.board[rank][file] = p;
    }
    for (const p of this.black.pieces.filter(p => !p.isCaptured)) {
      const [rank, file] = p.currentSquare;
      this.board[rank][file] = p;
    }
  }

  resetBoard(): void {
    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        this.board[rank][file] = null;
      }
    }
  }

  selectPiece(piece: IPiece): void {
    this.selectedPiece = piece;
  }

  canSelect(piece: IPiece): boolean {
    return piece.owner === this.activePlayer;
  }

  move(square: [number, number]): void {
    if (this.selectedPiece === null) {
      return;
    }
    // Remove current en passant pawn
    this.currentEnPassantPawn = null;
    // Make move
    this.selectedPiece.move(square);
    // Switch player
    this.activePlayer = this.activePlayer.getOpponent();
    // Update the board
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

  getWinner(): string {
    if (!this.isInCheckmate()) {
      return "";
    }
    return this.activePlayer === this.white ? "Black" : "White";
  }

  getActivePlayer(): string {
    if (this.isInCheckmate()) {
      return "";
    }
    return this.activePlayer === this.white ? "White" : "Black";
  }
}
