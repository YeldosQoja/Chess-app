import { ReactNode, useState } from "react";
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
} from "react-native";
import { useAppTheme } from "@/providers";

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
  const [focus, setFocus] = useState(false);

  return (
    <View
      style={[
        styles.container,
        { borderColor: focus ? colors.tint : colors.border },
        containerStyle,
      ]}>
      {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
      <TextInput
        {...rest}
        placeholderTextColor={colors.border}
        style={[styles.input, { color: colors.text }]}
        autoCapitalize="none"
        autoCorrect={false}
        onFocus={() => {
          setFocus(true);
        }}
        onBlur={() => {
          setFocus(false);
        }}
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
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 45,
    fontSize: 16,
    fontWeight: "500",
  },
  leftIcon: {
    marginRight: 12,
  },
  rightIcon: {
    marginLeft: 12,
  },
});
