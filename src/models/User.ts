export interface User {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  dateJoined: string;
  wins: number;
  losses: number;
  draws: number;
}

export interface Game {
  id: number;
  challenger: User;
  opponent: User;
  winner: number;
  duration: number;
}
