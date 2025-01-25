import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Controller, useForm } from "react-hook-form";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppTheme } from "@/contexts";
import { Input, ScreenContainer, Button } from "@/components";
import { signInSchema, useSignIn } from "@/queries/auth";

export default function SignIn() {
  const { colors } = useAppTheme();
  const { bottom } = useSafeAreaInsets();
  const [passwordHidden, setPasswordHidden] = useState(true);
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(signInSchema),
  });

  const signIn = useSignIn();
  const { isPending } = signIn;

  return (
    <ScreenContainer>
      <Text style={[styles.title, { color: colors.text }]}>
        Sign In to Your Account
      </Text>
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
            autoFocus
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
        mode="contained"
        onPress={handleSubmit((values) => {
          console.log("values", values);
          signIn.mutate(values);
        })}
        loading={isPending}
      >
        Sign in
      </Button>
      <View style={[styles.textLinkContainer, { bottom }]}>
        <Text style={{ color: colors.text }}>Don't have an account?</Text>
        <Link style={styles.link} replace href="/sign-up">
          <Text style={{ color: colors.tint }}>Sign up</Text>
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
