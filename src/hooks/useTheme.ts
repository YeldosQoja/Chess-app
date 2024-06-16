import { ThemeContext } from "@/providers";
import { useContext } from "react";

export const useTheme = () => {
  const theme = useContext(ThemeContext);
  return theme;
};
