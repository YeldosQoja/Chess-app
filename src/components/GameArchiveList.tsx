import { FlatList, FlatListProps } from "react-native";
import { Game } from "@/models";

export const GameArchiveList = (props: FlatListProps<Game>) => {
  return <FlatList {...props} />;
};
