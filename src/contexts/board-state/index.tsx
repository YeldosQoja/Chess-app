import { createContext } from "react";

type Props = {};

type BoardStateContextType = {};

const BoardStateContext = createContext<{
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  isDraw: boolean;
}>({
  isCheck: false,
  isCheckmate: false,
  isStalemate: false,
  isDraw: false,
});

export const useBoardState = () => {};

export const BoardStateProvider = () => {};
