import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "./axiosClient";
import { selectFriendRequest, selectGame, selectUser } from "./selectors";

export async function getProfile() {
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
    queryKey: ["profile", "friends", "list"],
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
    queryKey: ["profile", "games", "list"],
    queryFn: getProfileGames,
    select: (data) => data.map(selectGame),
    initialData: [],
  });
};

async function getFriendRequests() {
  const response = await axiosClient.get<any[]>("profile/requests/");
  return response.data;
}

export const useFriendRequests = () => {
  return useQuery({
    queryKey: ["profile", "requests", "list"],
    queryFn: getFriendRequests,
    select: (data) => data.map(selectFriendRequest),
    initialData: [],
  });
};
