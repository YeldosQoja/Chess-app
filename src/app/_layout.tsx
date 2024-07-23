import { AuthProvider, ThemeProvider, UserProvider } from "@/providers";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { DevToolsBubble } from "react-native-react-query-devtools";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <UserProvider>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            />
            <DevToolsBubble />
          </UserProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
