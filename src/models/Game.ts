import { User } from "./User";

export interface Game {
  id: number;
  board: string;
  turn: string;
  color: "white" | "black";
  winner: "white" | "black" | null;
  white: User;
  black: User;
}
