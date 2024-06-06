import { useState } from "react"
import { Game } from "./Chess";

export const useChess = () => {
    const [game, setGame] = useState(new Game());
    return game;
}