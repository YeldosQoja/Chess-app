import { Game, User, FriendRequest } from "@/models";

export const selectUser = (data: any): User => ({
  id: data.id,
  firstName: data.first_name,
  lastName: data.last_name,
  email: data.email,
  username: data.username,
  joinedAt: data.date_joined,
  isFriend: data.is_friend,
  isRequested: data.is_requested,
  ...data.profile,
});

export const selectGame = ({ white, black, ...rest }: any): Game => ({
  white: selectUser(white),
  black: selectUser(black),
  ...rest,
});

export const selectFriendRequest = ({
  id,
  sender,
  created_at,
}: any): FriendRequest => ({
  id,
  sender: selectUser(sender),
  createdAt: new Date(created_at),
});
