import { PropsWithChildren } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { useAppTheme } from "@/providers";

type Props = {
  scrollable?: boolean;
  isLoading?: boolean;
  style?: ViewStyle;
};

export const ScreenContainer = ({
  scrollable,
  children,
  isLoading = false,
  style,
}: PropsWithChildren<Props>) => {
  const {
    colors: { background, tint },
  } = useAppTheme();
  if (scrollable) {
    return (
      <ScrollView
        style={[
          styles.container,
          {
            backgroundColor: background,
          },
          style,
        ]}>
        {isLoading ? <ActivityIndicator color={tint} /> : children}
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
        style,
      ]}>
      {isLoading ? <ActivityIndicator color={tint} /> : children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
});
