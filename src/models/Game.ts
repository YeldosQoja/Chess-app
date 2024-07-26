import { User } from "./User";

export interface Game {
  id: number;
  challenger: User;
  opponent: User;
  winner: number;
  duration: number;
}
