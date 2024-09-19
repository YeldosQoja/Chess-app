import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "./axiosClient";
import { selectGame } from "./selectors";
import { Game } from "@/models";

async function getHome() {
  const response = await axiosClient.get<{ games: any[]; latest_game: any }>(
    "home/"
  );
  return response.data;
}

export const useHome = () =>
  useQuery({
    queryKey: ["home", "games", "list"],
    queryFn: getHome,
    select: ({ games, latest_game }): { games: Game[]; latestGame?: Game } => ({
      games: games.map(selectGame),
      latestGame: latest_game ? selectGame(latest_game) : latest_game,
    }),
  });
