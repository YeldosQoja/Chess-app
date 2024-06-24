import { ThemeContext } from "@/providers";
import { useContext } from "react";

export const useAppTheme = () => {
  const theme = useContext(ThemeContext);
  return theme;
};
