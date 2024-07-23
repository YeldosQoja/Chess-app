import { useMutation } from "@tanstack/react-query";
import { axiosClient } from "./axiosClient";

async function sendChallenge(userId: number) {
    return await axiosClient.post("game/challenge/send/" + userId);
}

export const useSendChallenge = () => useMutation({
    mutationFn: sendChallenge,
});