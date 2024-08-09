export interface User {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  joinedAt: string;
  wins: number;
  losses: number;
  draws: number;
  isFriend: boolean;
  isRequested: boolean;
}
