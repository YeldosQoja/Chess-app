import { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Avatar } from "react-native-paper";
import { User } from "@/models";
import { useAppTheme } from "@/contexts";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

type ProfileCardProps = {
  color: "white" | "black";
  time: number;
} & Pick<User, "avatar" | "firstName" | "lastName">;

export const ChessPlayerCard = ({
  avatar,
  firstName,
  lastName,
  color,
  time,
}: ProfileCardProps) => {
  const { colors } = useAppTheme();

  const isWhite = color === "white";

  const { activePlayer, moves } = gameState;
  const player = isWhite ? "white" : "black";
  const opponent = isWhite ? "black" : "white";
  const timer = useRef<any>(null);

  const [currElapsedTime, setCurrElapsedTime] = useState(0);
  const prevElapsedTime = useMemo(
    () =>
      moves.reduce((total, move) => {
        if (move.player !== player) return total;
        const { start, end } = move.timestamp;
        const duration = end.getTime() - start.getTime();
        return total + Math.floor(duration / 1000);
      }, 0),
    [moves, player],
  );

  const totalElapsedTime =
    (activePlayer === player ? currElapsedTime : 0) + prevElapsedTime;

  const secondsLeft = time - totalElapsedTime;

  useEffect(() => {
    const { activePlayer, timestampLastMove } = gameState;
    if (timestampLastMove) {
      if (activePlayer === player) {
        timer.current = setInterval(() => {
          const timeOffset = new Date().getTime() - timestampLastMove.getTime();
          setCurrElapsedTime(Math.floor(timeOffset / 1000));
        }, 1000);
      } else {
        setCurrElapsedTime(0);
      }
    }
    return () => {
      clearInterval(timer.current);
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
          {dayjs.duration(secondsLeft, "seconds").format("mm:ss")}
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
