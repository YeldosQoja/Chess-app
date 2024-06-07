import { IGame } from "./Chess";
import { King, Piece, PieceType } from "./Piece";

export class Player {
  pieces: Piece[] = [];
  game: IGame;
  constructor(game: IGame) {
    this.game = game;
  }

  getKing(): King {
    return this.pieces.find((p) => p.strategy.type === PieceType.King) as King;
  }
}
