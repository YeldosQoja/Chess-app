import { ReactElement, PropsWithChildren } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import {
  render,
  renderHook,
  RenderHookOptions,
  RenderHookResult,
  RenderOptions,
} from "@testing-library/react-native";
import {
  ThemeProvider,
  AuthContext,
  PromotionPickerProvider,
  ChessProvider,
  CurrentUserProfileProvider,
} from "@/contexts";
import { Game } from "@/models";

const queryClient = new QueryClient();

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultMode="light">
        <AuthContext.Provider
          value={{
            isLoading: false,
            isAuth: true,
            token: {
              access: "access key",
              refresh: "refresh key",
            },
            setToken: () => {},
          }}
        >
          <CurrentUserProfileProvider>{children}</CurrentUserProfileProvider>
        </AuthContext.Provider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

const customRender = (component: ReactElement, options?: RenderOptions) =>
  render(component, { wrapper: Providers, ...options });

const ChessProviders = ({
  children,
  game,
}: PropsWithChildren<{ game: Game }>) => {
  const { board, turn, color } = game;
  return (
    <PromotionPickerProvider color="white">
      <ChessProvider {...{ board, turn, color }}>{children}</ChessProvider>
    </PromotionPickerProvider>
  );
};

const renderChess = (
  component: ReactElement,
  game: Game,
  options?: RenderOptions,
) => {
  const Wrapper = ({ children }: PropsWithChildren) => (
    <ChessProviders game={game}>{children}</ChessProviders>
  );
  return customRender(component, { wrapper: Wrapper, ...options });
};

const customRenderHook = <R, P>(
  hook: (props?: P) => R,
  options?: RenderHookOptions<P>,
): RenderHookResult<R, P> => {
  return renderHook(hook, { ...options, wrapper: Providers });
};

export * from "@testing-library/react-native";

export { customRender as render, renderChess, customRenderHook as renderHook };
