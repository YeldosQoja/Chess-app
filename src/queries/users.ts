import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { axiosClient } from "./axiosClient";
import { User } from "@/models";

const selectUser = (data: any): User => ({
  id: data.id,
  firstName: data.first_name,
  lastName: data.last_name,
  email: data.email,
  username: data.username,
  dateJoined: `Joined at ${new Date(data.date_joined).toDateString()}`,
  avatar: data.profile.avatar,
  wins: data.profile.wins,
  losses: data.profile.losses,
  draws: data.profile.draws,
});

async function getUsers({ queryKey }: QueryFunctionContext) {
  const [_, __, username] = queryKey;
  const response = await axiosClient.get("users/", { params: { username } });
  return response.data;
}

export const useUsers = (username: string) =>
  useQuery({
    queryKey: ["users", "list", username],
    queryFn: getUsers,
    select: (data) => data.map(selectUser),
  });

async function getUserById({ queryKey }: QueryFunctionContext) {
  const [_key1, _key2, id] = queryKey;
  const response = await axiosClient.get(`users/${id}/`);
  return response.data;
}

export const useUserById = (id: string) =>
  useQuery({
    queryKey: ["users", "detail", id],
    queryFn: getUserById,
    initialData: {
      id: 1,
      username: "",
      email: "",
      first_name: "",
      last_name: "",
      date_joined: "",
      profile: {
        avatar: null,
        wins: 0,
        losses: 0,
        draws: 0,
        games: [],
      },
    },
    select: selectUser,
  });

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
