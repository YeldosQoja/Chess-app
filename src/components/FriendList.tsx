import { FlatList, FlatListProps, TextInputProps } from "react-native";
import { Input } from "./Input";
import { useAppTheme } from "@/hooks";
import Ionicons from "@expo/vector-icons/Ionicons";

interface Props extends FlatListProps<any> {
  searchBarProps: TextInputProps;
}

export const FriendList = ({ searchBarProps, ...listProps }: Props) => {
  const { colors } = useAppTheme();
  return (
    <FlatList
      keyExtractor={(_, index) => index.toString()}
      ListHeaderComponent={
        <Input
          placeholder="Search"
          placeholderTextColor={colors.border}
          leftIcon={
            <Ionicons
              name="search"
              size={22}
              color={colors.icon}
            />
          }
          {...searchBarProps}
        />
      }
      {...listProps}
    />
  );
};