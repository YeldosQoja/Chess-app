import { useEffect } from "react";
import { Redirect, SplashScreen } from "expo-router";
import { useAuth } from "@/contexts";

SplashScreen.hideAsync();

export default function Index() {
  const { isAuth, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    return null;
  }

  if (!isAuth) {
    return <Redirect href="/sign-in" />;
  }

  return <Redirect href="/home" />;
}
