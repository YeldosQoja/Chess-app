import { useState } from "react";
import { ListRenderItem } from "react-native";
import { FriendList, FriendListItem, ScreenContainer } from "@/components";
import { useFriends } from "@/queries/friends";
import { useUsers } from "@/queries/users";
import { User } from "@/models";

export default function Friends() {
  const [query, setQuery] = useState("");
  const { data, isPending, error } = useUsers(query);
  const renderItem: ListRenderItem<User> = ({
    item: { id, firstName, lastName },
    index,
  }) => {
    return (
      <FriendListItem
        id={id}
        name={`${firstName} ${lastName}`}
      />
    );
  };

  console.log(data);
  console.log(error);

  return (
    <ScreenContainer isLoading={isPending}>
      <FriendList
        data={data}
        renderItem={renderItem}
        searchBarProps={{
          value: query,
          onChangeText: setQuery,
        }}
      />
    </ScreenContainer>
  );
}
