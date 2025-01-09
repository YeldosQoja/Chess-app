import React from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "@/providers";
import { Button } from "./Button";
import { Avatar } from "react-native-paper";
import { User } from "@/models";

type GameResultModalProps = {
  visible: boolean;
  isWinner: boolean;
  winner: "white" | "black" | null;
  color: "white" | "black";
  white: User;
  black: User;
  onClose: () => void;
};

export const GameResultModal = ({
  visible,
  isWinner,
  winner,
  white,
  black,
  onClose,
}: GameResultModalProps) => {
  const { colors } = useAppTheme();
  return (
    <Modal visible={visible} transparent>
      <View style={styles.backdrop}>
        <View
          style={[
            styles.contentContainer,
            { backgroundColor: colors.background },
          ]}
        >
          <View
            style={[
              styles.header,
              {
                backgroundColor: winner
                  ? isWinner
                    ? "#3b9813"
                    : "#C7253E"
                  : "#758694",
              },
            ]}
          >
            <Text style={[styles.title, { color: "white" }]}>
              {winner !== null
                ? `${winner.charAt(0).toUpperCase() + winner.slice(1)} Wins`
                : "Draw"}
            </Text>
            {winner && (
              <Text style={[styles.message, { color: "white" }]}>
                {`${
                  isWinner
                    ? "You"
                    : winner === "white"
                      ? white.username
                      : black.username
                } win by checkmate`}
              </Text>
            )}
          </View>
          <View style={styles.scoreCard}>
            <View style={styles.player}>
              <Avatar.Image
                style={styles.avatar}
                source={{ uri: white?.avatar }}
              />
              <Text
                style={[
                  styles.playerName,
                  {
                    color: colors.text,
                  },
                ]}
              >{`${white.firstName} ${white.lastName}`}</Text>
            </View>
            <Text style={[styles.score, { color: colors.text }]}>{`${
              winner === "white" ? 1 : 0
            }-${winner === "white" ? 0 : 1}`}</Text>
            <View style={styles.player}>
              <Avatar.Image
                style={styles.avatar}
                source={{ uri: black?.avatar }}
              />
              <Text
                style={[
                  styles.playerName,
                  {
                    color: colors.text,
                  },
                ]}
              >{`${black.firstName} ${black.lastName}`}</Text>
            </View>
          </View>
          <Button
            mode="contained"
            style={styles.button}
            labelStyle={styles.buttonTitle}
            onPress={onClose}
          >
            Continue
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0.0, 0.0, 0.0, 0.5)",
    justifyContent: "center",
  },
  contentContainer: {
    margin: 24,
    borderRadius: 24,
    alignItems: "center",
  },
  header: {
    padding: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    alignSelf: "stretch",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  scoreCard: {
    alignSelf: "stretch",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    margin: 16,
    marginHorizontal: 24,
  },
  score: {
    fontSize: 18,
    fontWeight: "500",
  },
  player: {
    alignItems: "center",
  },
  avatar: {
    width: "30%",
    aspectRatio: 1,
    borderRadius: 120,
    marginBottom: 10,
  },
  playerName: {
    fontSize: 14,
    fontWeight: "600",
  },
  button: {
    alignSelf: "stretch",
    margin: 12,
  },
  buttonTitle: {
    fontWeight: "bold",
  },
});
