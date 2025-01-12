import { User } from "./User";

export interface Game {
  id: number;
  board: string;
  turn: "white" | "black";
  color: "white" | "black";
  winner: "white" | "black" | null;
  white: User;
  black: User;
}
