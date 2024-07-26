import { useMutation } from "@tanstack/react-query";
import { axiosClient } from "./axiosClient";
import { router } from "expo-router";

async function sendChallenge(userId: number) {
  const response = await axiosClient.post(`games/challenges/send/${userId}/`);
  return response.data;
}

export const useSendChallenge = () =>
  useMutation({
    mutationFn: sendChallenge,
    onSuccess: () => {
      router.navigate("/games/preview");
    },
  });

async function acceptChallenge(id: number) {
  const response = await axiosClient.post<{ game_id: number }>(
    `games/challenges/${id}/accept/`
  );
  return response.data;
}

export const useAcceptChallenge = () =>
  useMutation({
    mutationFn: acceptChallenge,
    onSuccess: (data) => {
      router.push(`/games/${data.game_id}`);
    },
  });
