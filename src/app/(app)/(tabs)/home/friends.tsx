import { FriendList, FriendListItem, ScreenContainer } from "@/components";
import { useState } from "react";
import { ListRenderItem } from "react-native";

export default function Friends() {
  const [query, setQuery] = useState("");
  const renderItem: ListRenderItem<any> = () => {
    return (
      <FriendListItem
        fullName="Jack Coleman"
        friendId={3}
        onChallenge={() => null}
      />
    );
  };
  return (
    <ScreenContainer>
      <FriendList
        data={Array(3).fill({ name: "item" })}
        renderItem={renderItem}
        searchBarProps={{
          value: query,
          onChangeText: setQuery,
        }}
      />
    </ScreenContainer>
  );
}
