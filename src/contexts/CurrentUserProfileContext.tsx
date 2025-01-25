import { createContext, PropsWithChildren, useContext } from "react";
import { User } from "@/models";
import { useProfile } from "@/queries/profile";
import { ActivityIndicator } from "react-native";

const CurrentUserProfileContext = createContext<User | null>(null);

export const useCurrentUserProfile = () => {
  const value = useContext(CurrentUserProfileContext);
  if (!value) {
    throw new Error("User Profile: No value provided!");
  }
  return value;
};

export const CurrentUserProfileProvider = ({ children }: PropsWithChildren) => {
  const userProfile = useProfile();

  if (userProfile.isPending) {
    return <ActivityIndicator />;
  }

  if (userProfile.isError) {
    return null;
  }

  return (
    <CurrentUserProfileContext.Provider value={userProfile.data}>
      {children}
    </CurrentUserProfileContext.Provider>
  );
};
