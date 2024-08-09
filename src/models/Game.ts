import { User } from "./User";

export interface Game {
  id: number;
  opponent: User;
  winner: number;
  duration: number;
  isFinished: boolean;
  isWinner: boolean;
  isWhite: boolean;
}
