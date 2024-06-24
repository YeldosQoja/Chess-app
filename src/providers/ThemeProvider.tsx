import { PropsWithChildren, createContext, useEffect, useState } from "react";
import {
  Colors,
  NavigationLightTheme,
  NavigationDarkTheme,
  PaperLightTheme,
  PaperDarkTheme,
} from "@/theme";
import { useColorScheme } from "@/hooks";
import { PaperProvider, adaptNavigationTheme } from "react-native-paper";
import { ThemeProvider as NavigationThemeProvider } from "@react-navigation/native";

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
  setDark: (value: boolean) => {},
});

interface Props {
  style?: "light" | "dark";
}

export const ThemeProvider = ({
  children,
  style,
}: PropsWithChildren<Props>) => {
  const systemColor = useColorScheme();
  const [dark, setDark] = useState(
    style ? style === "dark" : systemColor === "dark"
  );
  const colors = Colors[dark ? "dark" : "light"];
  const theme = dark ? CombinedDarkTheme : CombinedLightTheme;

  useEffect(() => {
    if (style === undefined) {
      setDark(systemColor === "dark");
    }
  }, [systemColor]);

  return (
    <ThemeContext.Provider
      value={{
        colors: colors,
        dark,
        setDark,
      }}>
      <PaperProvider theme={theme}>
        <NavigationThemeProvider value={theme}>
          {children}
        </NavigationThemeProvider>
      </PaperProvider>
    </ThemeContext.Provider>
  );
};
