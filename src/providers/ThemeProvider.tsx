import { PropsWithChildren, createContext, useEffect, useState } from "react";
import { Colors } from "@/constants";
import { useColorScheme } from "react-native";

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

  useEffect(() => {
    if (style === undefined) {
      setDark(systemColor === "dark");
    }
  }, [systemColor]);

  return (
    <ThemeContext.Provider
      value={{
        colors: Colors[dark ? "dark" : "light"],
        dark,
        setDark,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};
