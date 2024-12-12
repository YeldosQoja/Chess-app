import { createContext, PropsWithChildren, useContext, useEffect } from "react";
import { Alert } from "react-native";
import { useAcceptChallenge } from "@/queries/games";
import { useRouter } from "expo-router";
import { useLazy } from "@/hooks/useLazy";
import { SocketService } from "@/services/SocketService";
import { Challenge, ChallengeAccept, SocketData, SocketEvent } from "@/models";

const WebsocketContext = createContext<{ socket: SocketService | null }>({
  socket: null,
});

export const useWebsocket = () => {
  const value = useContext(WebsocketContext);
  return value;
};

export const WebsocketProvider = ({ children }: PropsWithChildren) => {
  const socket = useLazy(
    () => new SocketService(process.env.EXPO_PUBLIC_WS_URL + "main"),
  );
  const router = useRouter();
  const acceptChallenge = useAcceptChallenge();

  useEffect(() => {
    socket.on(SocketEvent.CHALLENGE, (data: SocketData<Challenge>) => {
      const { username, requestId } = data;
      Alert.alert("New Challenge!", `${username} invites you to play a match`, [
        {
          text: "Decline",
          style: "destructive",
        },
        {
          text: "Accept",
          isPreferred: true,
          style: "default",
          onPress: () => {
            acceptChallenge.mutate(requestId);
          },
        },
      ]);
    });

    socket.on(
      SocketEvent.CHALLENGE_ACCEPT,
      (data: SocketData<ChallengeAccept>) => {
        router.replace(`/games/${data.gameId}/`);
      },
    );

    socket.onError((e) => {
      console.log("websocket error", e);
    });

    return () => {
      socket.close();
    };
  }, [socket, router]);

  return (
    <WebsocketContext.Provider
      value={{
        socket,
      }}
    >
      {children}
    </WebsocketContext.Provider>
  );
};
