import { useTheme } from "@/hooks";
import { ReactNode } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

type Props = {
  title: string;
  icon?: ReactNode;
  onPress: () => void;
};

export const Button = ({ onPress, title, icon }: Props) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: colors.tint }]}
      onPress={onPress}>
      <Text style={styles.buttonTitle}>{title}</Text>
      {icon}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "white",
  },
});
