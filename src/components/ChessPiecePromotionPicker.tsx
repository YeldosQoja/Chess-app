import { useContext } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { ChessContext } from "@/providers";
import { PieceType } from "@/models";

const PIECE_PROMOTIONS = [
  PieceType.Queen,
  PieceType.Knight,
  PieceType.Rook,
  PieceType.Bishop,
];

export const ChessPiecePromotionPicker = () => {
  const { player } = useContext(ChessContext);

  const { promotionPickerOpen: open, selectPromotion } =
    useContext(ChessContext);

  return (
    <Modal
      style={styles.modal}
      animationType="none"
      transparent={true}
      visible={open}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          {PIECE_PROMOTIONS.map((pieceType, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.9}
              style={styles.item}
              onPress={() => void selectPromotion(pieceType)}
            >
              <Image source={`${pieceType}-${player}`} style={styles.image} />
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
  item: {
    width: "50%",
    height: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    height: "70%",
    aspectRatio: 1,
  },
});
