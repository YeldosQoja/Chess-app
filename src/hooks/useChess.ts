import { useState } from "react";
import { Chess } from "../models";

export const useChess = () => {
  const [game, setGame] = useState(new Chess());
  return game;
};
