import { PropsWithChildren, createContext, useContext, useState } from "react";
import {
  Colors,
  NavigationLightTheme,
  NavigationDarkTheme,
  PaperLightTheme,
  PaperDarkTheme,
} from "@/theme";
import { PaperProvider, adaptNavigationTheme } from "react-native-paper";
import { ThemeProvider as NavigationThemeProvider } from "@react-navigation/native";
import { useColorScheme } from "react-native";

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationLightTheme,
  reactNavigationDark: NavigationDarkTheme,
});

const CombinedLightTheme = {
  ...PaperLightTheme,
  ...LightTheme,
  colors: {
    ...PaperLightTheme.colors,
    ...LightTheme.colors,
  },
};
const CombinedDarkTheme = {
  ...PaperDarkTheme,
  ...DarkTheme,
  colors: {
    ...PaperDarkTheme.colors,
    ...DarkTheme.colors,
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

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const systemColor = useColorScheme();
  const [mode, setMode] = useState<Mode>("system");

  const dark = mode === "dark" || (mode === "system" && systemColor === "dark");

  const colors = Colors[dark ? "dark" : "light"];
  const theme = dark ? CombinedDarkTheme : CombinedLightTheme;

  return (
    <ThemeContext.Provider
      value={{
        colors,
        dark,
        setMode,
      }}>
      <PaperProvider theme={theme}>
        <NavigationThemeProvider value={theme}>
          {children}
        </NavigationThemeProvider>
      </PaperProvider>
    </ThemeContext.Provider>
  );
};
