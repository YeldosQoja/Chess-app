import { useStorageState } from "@/hooks/useStorageState";
import { axiosClient } from "@/queries/axiosClient";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type Token = {
  access: string;
  refresh: string;
};

type SetToken = (value: Token | null) => void;

const AuthContext = createContext<{
  isAuth: boolean;
  token: Token | null;
  isLoading: boolean;
  setToken: SetToken;
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

export const useToken = (): [[boolean, Token | null], SetToken] => {
  const [[isLoadingAccess, access], setAccess] = useStorageState("access");
  const [[isLoadingRefresh, refresh], setRefresh] = useStorageState("refresh");
  const token: Token | null = access && refresh ? { access, refresh } : null;

  const setToken = useCallback((value: Token | null) => {
    if (value) {
      setAccess(value.access);
      setRefresh(value.refresh);
    } else {
      setAccess(null);
      setRefresh(null);
    }
  }, []);

  return [[isLoadingAccess || isLoadingRefresh, token], setToken];
};

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [[isLoading, token], setToken] = useToken();
  useEffect(() => {
    if (token) {
      axiosClient.defaults.headers["Authorization"] = `Bearer ${token.access}`;
    }
  }, [token]);
  return (
    <AuthContext.Provider
      value={{
        isAuth: Boolean(token),
        token,
        isLoading,
        setToken,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
