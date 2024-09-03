import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "./axiosClient";
import { selectGame } from "./selectors";
import { Game } from "@/models";

async function getHome() {
  const response = await axiosClient.get("home/");
  return response.data;
}

export const useHome = () =>
  useQuery({
    queryKey: ["home", "games", "list"],
    queryFn: getHome,
    select: (data): { games: Game[]; latestGame: Game } => ({
      games: data.games.map(selectGame),
      latestGame: selectGame(data.latest_game),
    }),
  });
