import { FlatList, FlatListProps } from "react-native";
import { useAppTheme } from "@/providers";
import { User } from "@/models";
import { forwardRef } from "react";

export const FriendList = forwardRef<FlatList<User>, FlatListProps<User>>(
  ({ ...listProps }, ref) => {
    const { colors } = useAppTheme();
    return (
      <FlatList
        {...listProps}
        keyExtractor={(item, _) => item.id.toString()}
        ref={ref}
      />
    );
  }
);
