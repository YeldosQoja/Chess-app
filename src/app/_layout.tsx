if (__DEV__) {
  require("../../ReactotronConfig");
}
import { AuthProvider, ThemeProvider, UserProvider } from "@/providers";
import { WebsocketProvider } from "@/providers/WebsocketProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DevToolsBubble } from "react-native-react-query-devtools";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <UserProvider>
              <WebsocketProvider>
                <Stack
                  screenOptions={{
                    headerShown: false,
                  }}
                />
                <DevToolsBubble />
              </WebsocketProvider>
            </UserProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
