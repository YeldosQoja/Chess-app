import {
  BishopStrategy,
  Board,
  King,
  KingStrategy,
  KnightStrategy,
  PawnStrategy,
  Piece,
  PieceType,
  QueenStrategy,
  RookStrategy,
} from "./Piece";
import { Player } from "./Player";

export class Game {
  readonly board: Board;
  readonly white: Player;
  readonly black: Player;

  private activePlayer: Player;
  private selectedPiece: Piece | null = null;

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
    this.activePlayer = this.white;
  }

  startGame(): void {
    this.createPieces(this.white);
    this.createPieces(this.black);
    this.updateBoard();
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

  updateBoard(): void {
    this.resetBoard();
    for (const p of this.white.pieces) {
      const [rank, file] = p.currentSquare;
      this.board[rank][file] = p;
    }
    for (const p of this.black.pieces) {
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

  selectPiece(piece: Piece): void {
    this.selectedPiece = piece;
  }

  canSelect(piece: Piece): boolean {
    return piece.owner === this.activePlayer;
  }

  move(square: [number, number]): void {
    if (
      this.selectedPiece === null
    ) {
      return;
    }

    this.selectedPiece.move(square);
    const [x, y] = square;
    const prevPiece = this.board[x][y];

    // Delete piece that are previously in square activePlayer moved to
    if (prevPiece) {
      const otherPlayer =
        this.activePlayer === this.white ? this.black : this.white;
      otherPlayer.pieces = otherPlayer.pieces.filter((p) => p !== prevPiece);
    }

    // Switch player
    this.activePlayer =
      this.activePlayer === this.white ? this.black : this.white;

    // Update the board
    this.updateBoard();
  }

  isInCheckmate(): boolean {
    const king = this.activePlayer.pieces.find(
      (p) => p.strategy.type === PieceType.King
    ) as Piece;
    return (
      (king.strategy as KingStrategy).isInCheck(
        king.currentSquare,
        king.owner
      ) && this.isInStalemate()
    );
  }

  isInStalemate(): boolean {
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
