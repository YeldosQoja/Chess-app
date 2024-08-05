import { useRef } from "react";

export const useWs = (url: string) => {
  const socketRef = useRef<WebSocket>(null);
  if (socketRef.current === null) {
    // @ts-ignore
    socketRef.current = new WebSocket(url);
  }
  return socketRef.current;
};
