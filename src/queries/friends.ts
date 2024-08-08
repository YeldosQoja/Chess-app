import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "./axiosClient";
import { User } from "@/models";
import { Alert } from "react-native";

async function addFriend(id: number) {
  const response = await axiosClient.post<{
    message: string;
  }>(`friends/${id}/add/`);
  return response;
}

export const useAddFriend = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["friends", "addFriend"],
    mutationFn: addFriend,
    onSuccess: ({ data: { message } }) => {
      queryClient.invalidateQueries({ queryKey: ["users", "list"] });
      Alert.alert("", message, [
        { text: "OK", style: "default", isPreferred: true },
      ]);
    },
  });
};

async function removeFriend(id: number) {
  const response = await axiosClient.post(`friends/${id}/remove/`);
  return response;
}

export const useRemoveFriend = () =>
  useMutation({
    mutationKey: ["friends", "removeFriend"],
    mutationFn: removeFriend,
  });

async function acceptFriendRequest(id: number) {
  const response = await axiosClient.post(`friends/requests/${id}/accept/`);
  return response.data;
}

export const useAcceptFriendRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: (_, id) => {
      // queryClient.setQueryData(
      //   ["profile", "requests"],
      //   (requests: FriendRequest[]) => requests.filter((req) => req.id !== id)
      // );
      queryClient.invalidateQueries({ queryKey: ["profile", "requests"] });
      queryClient.invalidateQueries({ queryKey: ["profile", "friends"] });

      const profile: User | undefined = queryClient.getQueryData(["profile"]);
      if (profile) {
        queryClient.invalidateQueries({
          queryKey: ["users", "friends", "list", profile.id],
        });
      }
    },
  });
};

async function declineFriendRequest(id: number) {
  const response = await axiosClient.post(`friends/requests/${id}/decline/`);
  return response.data;
}

export const useDeclineFriendRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: declineFriendRequest,
    onSuccess: (_, id) => {
      // queryClient.setQueryData(
      //   ["profile", "requests"],
      //   (requests: FriendRequest[]) => requests.filter((req) => req.id !== id)
      // );
      queryClient.invalidateQueries({ queryKey: ["profile", "requests"] });
    },
  });
};
