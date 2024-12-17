import { PieceType } from "./PieceType";
import { Square } from "./Square";

export type SocketData<Type = {}> = Type & { type: string };

export enum SocketEvent {
  CHALLENGE = "challenge",
  CHALLENGE_ACCEPT = "challenge_accept",
  MOVE = "move",
  PROMOTION = "promotion",
}

export type Challenge = {
  requestId: number;
  username: string;
};

export type ChallengeAccept = {
  gameId: number;
};

export type Move = {
  player: "white" | "black";
  from: Square;
  to: Square;
  timestamp: {
    start: Date;
    end: Date;
  };
};

export type Promotion = {
  player: "white" | "black";
  square: Square;
  piece: PieceType;
  timestamp: {
    start: Date;
    end: Date;
  };
};
