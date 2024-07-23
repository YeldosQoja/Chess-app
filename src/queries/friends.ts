import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "./axiosClient";

async function getFriends() {
    return await axiosClient.get("friends/");
}

export const useFriends = () => useQuery({
    queryKey: ['friends', 'list'],
    queryFn: getFriends,
    select: (response) => response.data,
});