import { PropsWithChildren, createContext, useContext, useState } from "react";
import { useColorScheme } from "react-native";
import { PaperProvider } from "react-native-paper";
import { ThemeProvider as NavigationThemeProvider } from "@react-navigation/native";
import {
  Colors,
  NavigationLightTheme,
  NavigationDarkTheme,
  PaperLightTheme,
  PaperDarkTheme,
} from "@/theme";

const CombinedLightTheme = {
  ...PaperLightTheme,
  ...NavigationLightTheme,
  colors: {
    ...PaperLightTheme.colors,
    ...NavigationLightTheme.colors,
  },
};

const CombinedDarkTheme = {
  ...PaperDarkTheme,
  ...NavigationDarkTheme,
  colors: {
    ...PaperDarkTheme.colors,
    ...NavigationDarkTheme.colors,
  },
};

export const ThemeContext = createContext({
  colors: Colors.light,
  dark: false,
  setMode: (value: Mode) => {},
});

export const useAppTheme = () => {
  const theme = useContext(ThemeContext);
  return theme;
};

type Mode = "light" | "dark" | "system";

type ThemeProviderProps = {
  defaultMode?: "light" | "dark";
};

export const ThemeProvider = ({
  defaultMode,
  children,
}: PropsWithChildren<ThemeProviderProps>) => {
  const systemColor = useColorScheme();
  const [mode, setMode] = useState<Mode>(defaultMode || "system");

  const dark = mode === "dark" || (mode === "system" && systemColor === "dark");

  const colors = Colors[dark ? "dark" : "light"];
  const theme = dark ? CombinedDarkTheme : CombinedLightTheme;

  return (
    <ThemeContext.Provider
      value={{
        colors,
        dark,
        setMode,
      }}
    >
      <PaperProvider theme={theme}>
        <NavigationThemeProvider value={theme}>
          {children}
        </NavigationThemeProvider>
      </PaperProvider>
    </ThemeContext.Provider>
  );
};
