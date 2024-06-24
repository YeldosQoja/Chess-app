import { useAppTheme } from "@/hooks";
import { ReactNode, forwardRef } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

interface Props extends TouchableOpacityProps {
  title: string;
  icon?: ReactNode;
}

export const Button = forwardRef<TouchableOpacity, Props>(
  ({ style, title, icon, ...rest }, ref) => {
    const { colors } = useAppTheme();
    return (
      <TouchableOpacity
        ref={ref}
        style={[styles.button, { backgroundColor: colors.tint }, style]}
        {...rest}>
        <Text style={styles.buttonTitle}>{title}</Text>
        {icon}
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  button: {
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "white",
  },
});
