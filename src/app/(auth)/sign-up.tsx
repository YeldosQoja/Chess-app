import { Button, Input, ScreenContainer } from "@/components";
import { useAppTheme } from "@/hooks";
import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "expo-router";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { InferType, object, string } from "yup";

const schema = object({
  email: string().required().email(),
  username: string().required(),
  firstName: string(),
  lastName: string(),
  password: string().min(5),
  passwordConfirmation: string().min(5),
});

type SignUpFormType = InferType<typeof schema>;

export default function SignUp() {
  const { colors } = useAppTheme();
  const { bottom } = useSafeAreaInsets();
  const [passwordHidden, setPasswordHidden] = useState(false);
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });
  const handleSignUp: SubmitHandler<SignUpFormType> = (data) => {
    console.log(data);
  };
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
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.iconButton}
                onPress={() => void setPasswordHidden((prev) => !prev)}>
                <Ionicons
                  name="eye-off-outline"
                  size={22}
                  color={passwordHidden ? colors.tint : colors.icon}
                />
              </TouchableOpacity>
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
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.iconButton}
                onPress={() => void setPasswordHidden((prev) => !prev)}>
                <Ionicons
                  name="eye-off-outline"
                  size={22}
                  color={passwordHidden ? colors.tint : colors.icon}
                />
              </TouchableOpacity>
            }
          />
        )}
      />
      <Button
        title="Sign Up"
        onPress={handleSubmit(handleSignUp)}
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

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "500",
    marginVertical: 24,
  },
  iconButton: {
    position: "absolute",
    right: 12,
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
