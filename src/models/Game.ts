import { User } from "./User";

export interface Game {
  id: number;
  challenger: User;
  opponent: User;
  isWhite: boolean;
  winner: number;
  duration: number;
  isFinished: boolean;
}
