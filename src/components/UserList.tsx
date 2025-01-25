import { forwardRef } from "react";
import { FlatList, FlatListProps } from "react-native";
import { User } from "@/models";

export const UserList = forwardRef<FlatList<User>, FlatListProps<User>>(
  ({ ...listProps }, ref) => {
    return (
      <FlatList
        {...listProps}
        keyExtractor={(item, _) => item.id.toString()}
        ref={ref}
      />
    );
  },
);
