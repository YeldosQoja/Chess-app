import { Image } from "expo-image";

type Props = {
  imageUrl?: string;
  size?: number;
};

export const Avatar = ({ imageUrl, size = 24 }: Props) => {
  return (
    <Image
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: "gray",
      }}
      source={{ uri: imageUrl }}
      priority="high"
    />
  );
};
