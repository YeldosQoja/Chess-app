import { useTheme } from "@/hooks";
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
  const { colors } = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      {leftIcon}
      <TextInput
        {...rest}
        placeholderTextColor={colors.border}
        style={[styles.input, { borderColor: colors.border }]}
      />
      {rightIcon}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    fontSize: 15,
    padding: 14,
  },
});
