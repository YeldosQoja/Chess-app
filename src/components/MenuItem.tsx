import { forwardRef } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Image, ImageSource } from "expo-image";
import { useAppTheme } from "@/contexts";

type Props = {
  title: string;
  imageSrc: ImageSource;
  onPress?: () => void;
};

export const MenuItem = forwardRef<TouchableOpacity, Props>(
  ({ title, imageSrc, onPress }, ref) => {
    const { colors } = useAppTheme();
    return (
      <TouchableOpacity
        ref={ref}
        style={[styles.container, { borderColor: colors.border }]}
        onPress={onPress}>
        <Image
          style={styles.image}
          source={imageSrc}
        />
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    marginLeft: 16,
  },
  image: {
    width: 32,
    height: 32,
  },
});
