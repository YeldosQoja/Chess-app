import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Avatar } from "react-native-paper";
import { User } from "@/models";
import { useAppTheme, ChessContext } from "@/providers";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

type ProfileCardProps = {
  profile: User;
  isWhite: boolean;
  time: number;
};

export const ChessPlayerCard = ({
  profile: { avatar, firstName, lastName },
  isWhite,
  time,
}: ProfileCardProps) => {
  const { colors } = useAppTheme();
  const { gameState, finish } = useContext(ChessContext);
  const player = isWhite ? "white" : "black";
  const opponent = isWhite ? "black" : "white";
  const timer = useRef<any>(null);

  const [currElapsedTime, setCurrElapsedTime] = useState(0);
  const prevElapsedTime = useMemo(
    () =>
      gameState.moves.reduce((total, currMove, i, arr) => {
        if (i + 1 === arr.length || arr[i + 1].player !== player) {
          return total;
        }
        const nextMove = arr[i + 1];
        const timeOffset =
          new Date(nextMove.timestamp).getTime() -
          new Date(currMove.timestamp).getTime();
        return total + Math.floor(timeOffset / 1000);
      }, 0),
    [gameState, player],
  );

  const totalElapsedTime = currElapsedTime + prevElapsedTime;

  useEffect(() => {
    const { activePlayer, moves } = gameState;
    if (activePlayer === player && moves.length) {
      const start = moves.at(-1)!.timestamp;
      timer.current = setInterval(() => {
        const timeOffset = new Date().getTime() - start.getTime();
        setCurrElapsedTime(Math.floor(timeOffset / 1000));
      }, 1000);
    }
    return () => {
      clearInterval(timer.current);
      setCurrElapsedTime(0);
    };
  }, [gameState, player]);

  useEffect(() => {
    if (totalElapsedTime === time) {
      finish(new Date(), opponent);
      clearInterval(timer.current);
    }
  }, [totalElapsedTime, time, finish, opponent]);

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <Avatar.Image
        // @ts-ignore
        source={{ uri: avatar }}
        size={40}
      />
      <Text
        style={[styles.name, { color: colors.text }]}
      >{`${firstName} ${lastName}`}</Text>
      <View
        style={[
          styles.timer,
          {
            backgroundColor: isWhite ? "#e8e8e8" : "#282828",
          },
        ]}
      >
        <Text
          style={[styles.timerText, { color: isWhite ? "#282828" : "#e8e8e8" }]}
        >
          {dayjs.duration(time - totalElapsedTime, "seconds").format("mm:ss")}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    padding: 12,
  },
  name: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    marginLeft: 6,
  },
  timer: {
    padding: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    fontVariant: ["tabular-nums"],
  },
  timerText: {
    fontSize: 17,
    fontWeight: "500",
  },
});
