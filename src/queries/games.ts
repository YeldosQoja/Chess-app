import {
  QueryFunctionContext,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { axiosClient } from "./axiosClient";
import { useRouter } from "expo-router";
import { selectGame } from "./selectors";
import { User } from "@/models";

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

async function finishGame({
  id,
  winner,
  finishedAt,
}: {
  id: number;
  winner?: "white" | "black";
  finishedAt: Date;
}) {
  const response = await axiosClient.post(`games/${id}/finish/`, {
    winner,
    finished_at: finishedAt,
  });
  return response;
}

export const useFinishGame = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: finishGame,
    onSuccess: (_, { id, winner, finishedAt }) => {
      const profile = queryClient.getQueryData<User>(["profile"]);
      queryClient.setQueryData(["games", "detail", id], (data: any) => {
        const { white, black } = data;
        let isWinner = false;
        if (winner !== undefined) {
          isWinner = false;
        }
        if (white.id === profile?.id) {
          isWinner = winner === "white";
        } else if (black.id === profile?.id) {
          isWinner = winner === "black";
        }
        return {
          ...data,
          is_winner: isWinner,
          winner: winner ?? null,
          finished_at: finishedAt,
        };
      });
    },
  });
};
