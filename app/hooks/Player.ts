import { Game } from "./Chess";
import { King, KingStrategy, Piece, PieceType } from "./Piece";

export class Player {
  pieces: Piece[] = [];
  game: Game;
  constructor(game: Game) {
    this.game = game;
  }

  getKing(): King {
    return this.pieces.find((p) => p.strategy.type === PieceType.King) as King;
  }
}
