import * as React from "react";
import { StyleSheet, View } from "react-native";
import { ButtonProps, Button as PaperButton } from "react-native-paper";

export const Button = React.forwardRef<View, ButtonProps>(
  ({ style, labelStyle, contentStyle, ...rest }, ref) => {
    return (
      <PaperButton
        ref={ref}
        theme={{ roundness: 2 }}
        style={[styles.container, style]}
        labelStyle={[styles.title, labelStyle]}
        contentStyle={[contentStyle]}
        {...rest}
      />
    );
  }
);

const styles = StyleSheet.create({
  container: {
    height: 45,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
  },
});
