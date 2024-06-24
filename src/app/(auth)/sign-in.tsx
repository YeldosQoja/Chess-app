import { Button, Input, ScreenContainer } from "@/components";
import { useAppTheme } from "@/hooks";
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
  const { colors } = useAppTheme();
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
        title="Sign In"
        onPress={handleSubmit(handleSignin)}
      />
      <View style={[styles.textLinkContainer, { bottom }]}>
        <Text style={{ color: colors.text }}>Don't have an account?</Text>
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
