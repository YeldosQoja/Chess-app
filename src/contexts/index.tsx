import { PropsWithChildren, useCallback, useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
// import { DevToolsBubble } from "react-native-react-query-devtools";
import { ThemeProvider } from "./ThemeContext";
import { AuthContext, Token } from "./AuthContext";
import { useStorageState } from "@/hooks/useStorageState";
import { axiosClient } from "@/queries/axiosClient";

if (__DEV__) {
  require("../../ReactotronConfig");
}

const queryClient = new QueryClient();

export const AppProvider = ({ children }: PropsWithChildren) => {
  const [[isLoading, token], setToken] = useStorageState("token");

  useEffect(() => {
    if (token) {
      const { access } = JSON.parse(token) as Token;
      axiosClient.defaults.headers["Authorization"] = `Bearer ${access}`;
    }
  }, [token]);

  const setNewToken = useCallback(
    (value: Token | null) => {
      const json = value ? JSON.stringify(value) : null;
      setToken(json);
    },
    [setToken],
  );

  return (
    <GestureHandlerRootView>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthContext.Provider
            value={{
              isLoading,
              isAuth: !!token,
              token: token ? JSON.parse(token) : null,
              setToken: setNewToken,
            }}
          >
            {children}
          </AuthContext.Provider>
          {/* <DevToolsBubble /> */}
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
};

export * from "./ThemeContext";
export * from "./AuthContext";
export * from "./WebsocketContext";
export * from "./ChessContext";
export * from "./promotion-picker";
export * from "./CurrentUserProfileContext";
