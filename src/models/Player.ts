import { IChess } from "./Chess";
import { King, Piece } from "./Piece";
import { PieceType } from "./PieceType";

export class Player {
  pieces: Piece[] = [];
  game: IChess;
  constructor(game: IChess) {
    this.game = game;
  }

  getKing(): King {
    return this.pieces.find((p) => p.strategy.type === PieceType.King) as King;
  }

  getOpponent(): Player {
    return this.game.white === this ? this.game.black : this.game.white;
  }
}
