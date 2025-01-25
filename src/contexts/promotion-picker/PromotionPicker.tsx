import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { PieceType } from "@/models";

const PIECE_PROMOTIONS = [
  PieceType.Queen,
  PieceType.Knight,
  PieceType.Rook,
  PieceType.Bishop,
];

type Props = {
  open: boolean;
  onSelect: (_: PieceType) => void;
  color: "white" | "black";
};

export const PromotionPicker = ({ open, onSelect, color }: Props) => {
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
              onPress={() => void onSelect(pieceType)}
            >
              <Image source={`${pieceType}${color[0]}`} style={styles.image} />
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
