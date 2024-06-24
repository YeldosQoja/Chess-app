import { useAppTheme } from "@/hooks";
import { ReactNode } from "react";
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
} from "react-native";

interface InputProps extends TextInputProps {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  containerStyle?: StyleProp<TextStyle>;
}

export const Input = ({
  style,
  containerStyle,
  leftIcon,
  rightIcon,
  ...rest
}: InputProps) => {
  const { colors } = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        { borderColor: colors.border },
        containerStyle,
      ]}>
      {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
      <TextInput
        {...rest}
        placeholderTextColor={colors.border}
        style={[styles.input, { color: colors.text }]}
      />
      {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 6,
    padding: 14,
  },
  input: {
    flex: 1,
    fontSize: 15,
  },
  leftIcon: {
    marginRight: 12,
  },
  rightIcon: {
    marginLeft: 12,
  },
});
