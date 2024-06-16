import { PropsWithChildren, createContext } from "react";
import { Colors } from "@/constants";
import { useColorScheme } from "react-native";

export const ThemeContext = createContext(Colors.light);

interface Props {
  mode?: "light" | "dark";
}

export const ThemeProvider = ({ children, mode }: PropsWithChildren<Props>) => {
  const systemColor = useColorScheme();
  return (
    <ThemeContext.Provider
      value={
        mode ? Colors[mode] : systemColor ? Colors[systemColor] : Colors.light
      }>
      {children}
    </ThemeContext.Provider>
  );
};
