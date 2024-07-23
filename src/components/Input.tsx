import { forwardRef, ReactNode, useState } from "react";
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";
import { useAppTheme } from "@/providers";

interface InputProps extends TextInputProps {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ style, containerStyle, leftIcon, rightIcon, onFocus, ...rest }, ref) => {
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
          ref={ref}
          placeholderTextColor={colors.border}
          style={[styles.input, { color: colors.text }, style]}
          autoCapitalize="none"
          autoCorrect={false}
          onFocus={(e) => {
            setFocus(true);
            if (onFocus) {
              onFocus(e);
            }
          }}
          onBlur={() => {
            setFocus(false);
          }}
        />
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>
    );
  }
);

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
