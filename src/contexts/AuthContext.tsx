import { createContext, useContext } from "react";

export type Token = {
  access: string;
  refresh: string;
};

export const AuthContext = createContext<{
  isAuth: boolean;
  token: Token | null;
  isLoading: boolean;
  setToken: (value: Token | null) => void;
}>({
  isAuth: false,
  token: null,
  isLoading: false,
  setToken: () => null,
});

export const useAuth = () => {
  const value = useContext(AuthContext);
  return value;
};
