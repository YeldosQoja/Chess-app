import { ReactNode, forwardRef } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { useAppTheme } from "@/providers";

interface Props extends TouchableOpacityProps {
  title: string;
  icon?: ReactNode;
  isLoading?: boolean;
}

export const Button = forwardRef<TouchableOpacity, Props>(
  ({ style, title, icon, isLoading, ...rest }, ref) => {
    const {
      colors: { tint },
    } = useAppTheme();
    return (
      <TouchableOpacity
        ref={ref}
        style={[styles.button, { backgroundColor: tint }, style]}
        disabled={isLoading}
        {...rest}>
        {isLoading ? (
          <ActivityIndicator color={"white"} />
        ) : (
          <>
            <Text style={styles.buttonTitle}>{title}</Text>
            {icon}
          </>
        )}
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "white",
  },
});
