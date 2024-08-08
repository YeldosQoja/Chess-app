import { Game, User, FriendRequest } from "@/models";

export const selectUser = (data: any): User => ({
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
  isFriend: data.is_friend,
  isRequested: data.is_requested,
});

export const selectGame = ({
  is_white,
  is_active,
  started_at,
  finished_at,
  challenger,
  opponent,
  ...rest
}: any): Game => ({
  challenger: selectUser(challenger),
  opponent: selectUser(opponent),
  isWhite: is_white,
  isFinished: !is_active,
  duration:
    new Date(finished_at).getSeconds() - new Date(started_at).getSeconds(),
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
