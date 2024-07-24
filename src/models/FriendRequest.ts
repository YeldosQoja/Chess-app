import { User } from "./User";

export interface FriendRequest {
    id: number;
    sender: User;
    createdAt: Date;
}