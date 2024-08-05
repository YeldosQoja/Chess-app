import { createContext, PropsWithChildren, useContext, useEffect } from "react";
import { Alert } from "react-native";
import { useAcceptChallenge } from "@/queries/games";
import { useRouter } from "expo-router";
import { useWs } from "@/hooks/useWs";

const WebsocketContext = createContext<{ ws: WebSocket | null }>({ ws: null });

export const useWebsocket = () => {
  const value = useContext(WebsocketContext);
  return value;
};

export const WebsocketProvider = ({ children }: PropsWithChildren) => {
  const ws = useWs("ws://127.0.0.1:8000/ws/main/");
  const router = useRouter();
  const acceptChallenge = useAcceptChallenge();

  useEffect(() => {
    ws.onopen = (e) => {
      console.log("connected", e);
    };

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log("websocket data", data);
      if (data.type === "challenge") {
        const { user, request_id } = data;
        Alert.alert(
          "New Challenge!",
          `${user.username} invites you to play a match`,
          [
            {
              text: "Decline",
              style: "destructive",
              onPress: () => {},
            },
            {
              text: "Accept",
              isPreferred: true,
              style: "default",
              onPress: () => {
                acceptChallenge.mutate(request_id);
              },
            },
          ]
        );
      } else if (data.type === "challenge_accepted") {
        router.replace(`/games/${data.game_id}/`);
      }
    };

    ws.onerror = (e) => {
      console.log("websocket error", e);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <WebsocketContext.Provider
      value={{
        ws,
      }}>
      {children}
    </WebsocketContext.Provider>
  );
};
