import { IGame } from "./Game";
import { King, Piece } from "./Piece";
import { PieceType } from "./PieceType";

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
