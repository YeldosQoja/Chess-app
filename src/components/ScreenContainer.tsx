import { PropsWithChildren } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View,
  useColorScheme,
} from "react-native";
import { useAppTheme } from "@/providers";

type Props = {
  scrollable?: boolean;
  isLoading?: boolean;
};

export const ScreenContainer = ({
  scrollable,
  children,
  isLoading = false,
}: PropsWithChildren<Props>) => {
  const {
    colors: { background, tint },
  } = useAppTheme();
  const systemColor = useColorScheme();
  if (scrollable) {
    return (
      <ScrollView
        style={[
          styles.container,
          {
            backgroundColor: background,
          },
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
