import axios, { AxiosError } from "axios";
import { router } from "expo-router";
import { Alert } from "react-native";

export const axiosClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASE_URL + "api/",
});

axiosClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.log("error", error);
    return error;
  },
);

axiosClient.interceptors.response.use(
  (response) => {
    console.log("response data", response.data);
    return response;
  },
  (error: AxiosError) => {
    console.log("error", error.response);
    const data = error.response?.data;
    if (
      typeof data === "object" &&
      data !== null &&
      data.hasOwnProperty("message")
    ) {
      Alert.alert("", data.message, [
        { text: "OK", style: "default", isPreferred: true },
      ]);
    }
    if (error.response?.status === 401) {
      router.replace("/sign-in");
    }
    throw error;
  },
);
