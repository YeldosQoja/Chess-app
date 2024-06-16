import { useTheme } from "@/hooks";
import { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

export const ScreenContainer = ({ children }: PropsWithChildren) => {
  const { background } = useTheme();
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
  },
});
