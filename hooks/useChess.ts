import { useState } from "react";
import { Game } from "../models";

export const useChess = () => {
  const [game, setGame] = useState(new Game());
  return game;
};
