import { View, Modal, StyleSheet, TouchableOpacity, Image } from "react-native";
import React from "react";
import Images from "@/assets/images/chess";
import {
  IGame,
  BishopStrategy,
  KnightStrategy,
  QueenStrategy,
  RookStrategy,
} from "@/models";

interface Props {
  open: boolean;
  isWhite: boolean;
  game: IGame;
  onSelect: (promotion: any) => void;
}

export const PromotionPicker = ({ open, isWhite, game, onSelect }: Props) => {
  const player = isWhite ? "white" : "black";
  const promotions = [
    {
      image: Images.queen[player],
      strategy: new QueenStrategy(game),
    },
    {
      image: Images.knight[player],
      strategy: new KnightStrategy(game),
    },
    {
      image: Images.rook[player],
      strategy: new RookStrategy(game),
    },
    {
      image: Images.bishop[player],
      strategy: new BishopStrategy(game),
    },
  ];
  return (
    <Modal
      style={styles.modal}
      animationType="none"
      transparent={true}
      visible={open}>
      <View style={styles.container}>
        <View style={styles.content}>
          {promotions.map((promotion, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.9}
              style={styles.pieceItem}
              onPress={() => void onSelect(promotion)}>
              <Image
                source={promotion.image}
                style={styles.pieceImage}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    backgroundColor: "white",
    width: "30%",
    aspectRatio: 1,
    borderRadius: 12,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  pieceItem: {
    width: "50%",
    height: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  pieceImage: {
    height: "70%",
    aspectRatio: 1,
  },
});
