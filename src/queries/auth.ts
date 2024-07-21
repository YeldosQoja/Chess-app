import { useMutation } from "@tanstack/react-query";
import { axiosClient } from "./axiosClient";
import { useAuth } from "@/providers";
import { InferType, object, string } from "yup";
import { router } from "expo-router";

export const signInSchema = object({
  email: string().required().email(),
  password: string().required().min(4),
});

type SignInForm = InferType<typeof signInSchema>;

async function signIn(credentials: SignInForm) {
  return await axiosClient.post<{ access: string; refresh: string }>(
    "auth/signin/",
    credentials
  );
}

export const useSignIn = () => {
  const { setToken } = useAuth();
  return useMutation({
    mutationFn: signIn,
    onSuccess: ({ data }) => {
      setToken(data);
      router.replace("/home");
    },
    onError: (error) => {
      console.log("error:", error);
    },
  });
};

export const signUpSchema = object({
  email: string().required().email(),
  username: string().required(),
  firstName: string(),
  lastName: string(),
  password: string().min(5),
  passwordConfirmation: string().min(5),
});

type SignUpForm = InferType<typeof signUpSchema>;

async function signUp(credentials: SignUpForm) {
  return await axiosClient.post("auth/signup/", credentials);
}

export const useSignUp = () =>
  useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      router.replace("/sign-in");
    },
  });
