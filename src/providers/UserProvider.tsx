import { User as UserModel } from "@/models";
import { createContext, PropsWithChildren, useContext, useState } from "react";

const UserContext = createContext<{
  user: UserModel | null;
  setUser: (value: UserModel | null) => void;
}>({
  user: null,
  setUser: () => {},
});

export const useUser = () => {
  const value = useContext(UserContext);
  return value;
};

export const UserProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<UserModel | null>(null);
  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
      }}>
      {children}
    </UserContext.Provider>
  );
};
