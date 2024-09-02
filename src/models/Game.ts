import { User } from "./User";

export interface Game {
  id: number;
  white: User;
  black: User;
  opponent: User;
  winner: "white" | "black" | null;
  duration: number;
  isFinished: boolean;
  isWinner: boolean;
  isWhite: boolean;
  player: "white" | "black";
}
