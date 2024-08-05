//
import { useRef } from "react";
import {
  Chess,
  IChess,
  QueenStrategy,
  KnightStrategy,
  RookStrategy,
  BishopStrategy,
  PawnPromotion,
} from "@/models";
import images from "@/assets/images/chess";

const { queen, knight, bishop, rook } = images;

export const useChess = (): [IChess, PawnPromotion[]] => {
  const gameRef = useRef<IChess>(null);
  const pawnPromotionsRef = useRef<PawnPromotion[]>(null);

  if (gameRef.current === null) {
    // @ts-ignore
    gameRef.current = new Chess();
  }

  if (pawnPromotionsRef.current === null) {
    const game = gameRef.current;
    // @ts-ignore
    pawnPromotionsRef.current = [
      {
        image: queen,
        strategy: new QueenStrategy(game),
      },
      {
        image: knight,
        strategy: new KnightStrategy(game),
      },
      {
        image: bishop,
        strategy: new BishopStrategy(game),
      },
      {
        image: rook,
        strategy: new RookStrategy(game),
      },
    ];
  }

  return [gameRef.current, pawnPromotionsRef.current];
};
