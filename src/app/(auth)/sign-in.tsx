import { Button, Input, ScreenContainer } from "@/components";
import { useTheme } from "@/hooks";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Link } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { InferType, object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = object({
  email: string().required().email(),
  password: string().required().min(4),
});

type SignInFormType = InferType<typeof schema>;

export default function SignIn() {
  const { colors } = useTheme();
  const { bottom } = useSafeAreaInsets();
  const [passwordHidden, setPasswordHidden] = useState(false);
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });
  const handleSignin: SubmitHandler<SignInFormType> = (data) => {
    console.log(data);
  };

  return (
    <ScreenContainer>
      <Text style={styles.title}>Sign In to Your Account</Text>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder="Your Email"
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
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder="Your Password"
            secureTextEntry={passwordHidden}
            textContentType="password"
            placeholderTextColor={colors.border}
            containerStyle={styles.input}
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
        title="Sign In"
        onPress={handleSubmit(handleSignin)}
      />
      <View style={[styles.textLinkContainer, { bottom }]}>
        <Text>Don't have an account?</Text>
        <Link
          style={styles.link}
          replace
          href="/sign-up">
          <Text style={{ color: colors.tint }}>Sign up</Text>
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
  input: {
    marginBottom: 18,
  },
  iconButton: {
    position: "absolute",
    right: 12,
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
