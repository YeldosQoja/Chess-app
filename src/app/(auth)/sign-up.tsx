import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "@/providers";
import { Button, Input, ScreenContainer } from "@/components";
import { signUpSchema, useSignUp } from "@/queries/auth";

export default function SignUp() {
  const { colors } = useAppTheme();
  const { bottom } = useSafeAreaInsets();
  const [passwordHidden, setPasswordHidden] = useState(true);
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(signUpSchema),
  });
  const signUp = useSignUp();
  const { isPending } = signUp;
  return (
    <ScreenContainer>
      <Text style={[styles.title, { color: colors.text }]}>
        Create an account
      </Text>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            value={value}
            placeholder="Email"
            onChangeText={onChange}
            onBlur={onBlur}
            placeholderTextColor={colors.border}
            containerStyle={styles.input}
            autoFocus
          />
        )}
      />
      <Controller
        control={control}
        name="username"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            value={value}
            placeholder="Your Username"
            onChangeText={onChange}
            onBlur={onBlur}
            placeholderTextColor={colors.border}
            containerStyle={styles.input}
          />
        )}
      />
      <Controller
        control={control}
        name="firstName"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            value={value}
            placeholder="First Name"
            onChangeText={onChange}
            onBlur={onBlur}
            placeholderTextColor={colors.border}
            containerStyle={styles.input}
          />
        )}
      />
      <Controller
        control={control}
        name="lastName"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            value={value}
            placeholder="Last Name"
            onChangeText={onChange}
            onBlur={onBlur}
            placeholderTextColor={colors.border}
            containerStyle={styles.input}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            value={value}
            placeholder="Your Password"
            onChangeText={onChange}
            onBlur={onBlur}
            placeholderTextColor={colors.border}
            containerStyle={styles.input}
            secureTextEntry={passwordHidden}
            rightIcon={
              <Ionicons.Button
                name="eye-off-outline"
                size={22}
                color={passwordHidden ? colors.tint : colors.icon}
                onPress={() => void setPasswordHidden((prev) => !prev)}
                backgroundColor="transparent"
                underlayColor="transparent"
                {...iconButtonStyles}
              />
            }
          />
        )}
      />
      <Controller
        control={control}
        name="passwordConfirmation"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            value={value}
            placeholder="Confirm Your Password"
            onChangeText={onChange}
            onBlur={onBlur}
            placeholderTextColor={colors.border}
            containerStyle={styles.input}
            secureTextEntry={passwordHidden}
            rightIcon={
              <Ionicons.Button
                name="eye-off-outline"
                size={22}
                color={passwordHidden ? colors.tint : colors.icon}
                onPress={() => void setPasswordHidden((prev) => !prev)}
                backgroundColor="transparent"
                underlayColor="transparent"
                {...iconButtonStyles}
              />
            }
          />
        )}
      />
      <Button
        title="Sign Up"
        onPress={handleSubmit((values) => {
          signUp.mutate(values);
        })}
        isLoading={isPending}
      />
      <View style={[styles.textLinkContainer, { bottom }]}>
        <Text style={{ color: colors.text }}>Already have an account?</Text>
        <Link
          style={styles.link}
          replace
          href="/sign-in">
          <Text style={{ color: colors.tint }}>Sign in</Text>
        </Link>
      </View>
    </ScreenContainer>
  );
}

const iconButtonStyles = StyleSheet.create({
  style: {
    padding: 0,
  },
  iconStyle: {
    marginRight: 0,
  },
});

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "500",
    marginVertical: 24,
  },
  input: {
    marginBottom: 18,
  },
  textLinkContainer: {
    flexDirection: "row",
    alignSelf: "center",
    position: "absolute",
  },
  link: {
    marginLeft: 4,
  },
});
