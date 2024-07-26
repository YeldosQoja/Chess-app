import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
} from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import { useAcceptChallenge } from "@/queries/games";

const WebsocketContext = createContext<{ ws: WebSocket | null }>({ ws: null });

export const useWebsocket = () => {
  const value = useContext(WebsocketContext);
  return value;
};

export const WebsocketProvider = ({ children }: PropsWithChildren) => {
  const ws = useRef(new WebSocket("ws://127.0.0.1:8000/ws/main/"));

  const acceptChallenge = useAcceptChallenge();

  useEffect(() => {
    ws.current.onopen = (e) => {
      console.log("connected", e);
    };

    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === "challenge") {
        const { user, request_id } = data;
        Alert.prompt(
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

    ws.current.onerror = (e) => {
      console.log(e);
    };

    return () => {
      ws.current.close();
    };
  }, []);

  return (
    <WebsocketContext.Provider
      value={{
        ws: ws.current,
      }}>
      {children}
    </WebsocketContext.Provider>
  );
};
