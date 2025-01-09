import { Move } from "./Move";
import { PieceType } from "./PieceType";

export type SocketData<Type = {}> = Type & { type: string };

export enum SocketEvent {
  CHALLENGE = "challenge",
  CHALLENGE_ACCEPT = "challenge_accept",
  MOVE = "move",
}

export type Challenge = {
  requestId: number;
  username: string;
};

export type ChallengeAccept = {
  gameId: number;
};

export type MoveData = {
  player: "white" | "black";
  promotion: PieceType;
  timestamp: {
    start: Date;
    end: Date;
  };
} & Move;
