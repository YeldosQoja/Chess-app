import { createContext, PropsWithChildren, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { GameSocketService } from "@/services/SocketService";

export const ChessContext = createContext<{}>({});

type Props = {
  fen: string;
  socketService: GameSocketService;
};

export const ChessProvider = ({
  fen,
  socketService,
  children,
}: PropsWithChildren<Props>) => {
  const { id } = useLocalSearchParams<{ id: string }>();

  useEffect(() => {
    socketService.onMove(() => {});

    return socketService.close;
  }, [socketService]);

  return <ChessContext.Provider value={{}}>{children}</ChessContext.Provider>;
};
