import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { axiosClient } from "./axiosClient";
import { selectGame, selectUser } from "./selectors";

async function getUsers({ queryKey }: QueryFunctionContext) {
  const query = queryKey[2];
  const response = await axiosClient.get<any[]>("users/", {
    params: { query },
  });
  return response.data;
}

export const useUsers = (query: string) =>
  useQuery({
    queryKey: ["users", "list", query],
    queryFn: getUsers,
    select: (data) => data.map(selectUser),
    initialData: [],
  });

async function getUserById({ queryKey }: QueryFunctionContext) {
  const id = queryKey[2];
  const response = await axiosClient.get(`users/${id}/`);
  return response.data;
}

export const useUserById = (id: number) =>
  useQuery({
    queryKey: ["users", "detail", id],
    queryFn: getUserById,
    select: selectUser,
  });

async function getFriendsByUserId({ queryKey }: QueryFunctionContext) {
  const userId = queryKey[3];
  const response = await axiosClient.get<any[]>(`users/${userId}/friends/`);
  return response.data;
}

export const useFriendsByUserId = (userId: number) =>
  useQuery({
    queryKey: ["users", "friends", "list", userId],
    queryFn: getFriendsByUserId,
    select: (data) => data.map(selectUser),
  });

async function getGamesByUserId({ queryKey }: QueryFunctionContext) {
  const userId = queryKey[3];
  const response = await axiosClient.get<any[]>(`users/${userId}/games/`);
  return response.data;
}

export const useGamesByUserId = (userId: number) =>
  useQuery({
    queryKey: ["users", "games", "list", userId],
    queryFn: getGamesByUserId,
    select: (data) => data.map(selectGame),
  });
