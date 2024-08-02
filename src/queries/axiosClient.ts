import axios, { AxiosError } from "axios";
import { router } from "expo-router";

export const axiosClient = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

axiosClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.log("error", error);
    return error;
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    console.log("response data", response.data);
    return response;
  },
  (error: AxiosError) => {
    console.log("error", error);
    if (error.response?.status === 401) {
      router.replace("/sign-in");
    }
    return error;
  }
);
