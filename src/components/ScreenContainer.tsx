import { useAppTheme } from "@/hooks";
import { StatusBar } from "expo-status-bar";
import { PropsWithChildren, useEffect } from "react";
import { ScrollView, StyleSheet, View, useColorScheme } from "react-native";

type Props = {
  scrollable?: boolean;
};

export const ScreenContainer = ({
  scrollable,
  children,
}: PropsWithChildren<Props>) => {
  const {
    colors: { background },
  } = useAppTheme();
  const systemColor = useColorScheme();
  if (scrollable) {
    return (
      <ScrollView
        contentContainerStyle={[
          styles.container,
          {
            backgroundColor: background,
          },
        ]}>
        {children}
      </ScrollView>
    );
  }
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
