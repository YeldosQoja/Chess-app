import { useTheme } from "@/hooks";
import { StatusBar } from "expo-status-bar";
import { PropsWithChildren, useEffect } from "react";
import { StyleSheet, View, useColorScheme } from "react-native";

export const ScreenContainer = ({ children }: PropsWithChildren) => {
  const {
    colors: { background },
  } = useTheme();
  const systemColor = useColorScheme();
  useEffect(() => {
    StatusBar;
  }, [systemColor]);
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: background,
        },
      ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
});
