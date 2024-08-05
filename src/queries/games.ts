import {
  QueryFunctionContext,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { axiosClient } from "./axiosClient";
import { useRouter } from "expo-router";
import { Square } from "@/models";
import { selectGame } from "./selectors";

async function getGameById({ queryKey }: QueryFunctionContext) {
  const [_, __, id] = queryKey;
  const response = await axiosClient.get(`games/${id}/`);
  return response.data;
}

export const useGetGameById = (id: number) =>
  useQuery({
    queryKey: ["games", "detail", id],
    queryFn: getGameById,
    select: selectGame,
  });

async function sendChallenge(userId: number) {
  const response = await axiosClient.post(`games/challenges/send/${userId}/`);
  return response.data;
}

export const useSendChallenge = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: sendChallenge,
    onSuccess: () => {
      router.navigate("/games/preview");
    },
  });
};

async function acceptChallenge(id: number) {
  const response = await axiosClient.post<{ game_id: number }>(
    `games/challenges/${id}/accept/`
  );
  return response.data;
}

export const useAcceptChallenge = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: acceptChallenge,
    onSuccess: (data) => {
      router.push(`/games/${data.game_id}`);
    },
  });
};

export async function sendMove({
  id,
  move,
}: {
  id: number;
  move: { from: Square; to: Square };
}) {
  const response = await axiosClient.post(`games/${id}/move/`, { ...move });
  return response.data;
}
