import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "./axiosClient";
import { selectGame, selectUser } from "./selectors";

async function getProfile() {
  const response = await axiosClient.get("profile/");
  return response.data;
}

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    select: selectUser,
  });
};

async function getProfileFriends() {
  const response = await axiosClient.get<any[]>("profile/friends/");
  return response.data;
}

export const useProfileFriends = () => {
  return useQuery({
    queryKey: ["profile", "friends"],
    queryFn: getProfileFriends,
    select: (data) => data.map(selectUser),
  });
};

async function getProfileGames() {
  const response = await axiosClient.get<any[]>("profile/games/");
  return response.data;
}

export const useProfileGames = () => {
  return useQuery({
    queryKey: ["profile", "games"],
    queryFn: getProfileGames,
    select: (data) => data.map(selectGame),
    initialData: [],
  });
};

