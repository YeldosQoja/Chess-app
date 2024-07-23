import { useRef, useState } from "react";
import {
  Dimensions,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { FriendList, FriendItem, ScreenContainer, Input } from "@/components";
import { useUsers } from "@/queries/users";
import { User } from "@/models";
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "@/providers";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useProfileFriends } from "@/queries/profile";
import { useDebounce } from "@/hooks";

const { width } = Dimensions.get("window");

const HEADER_HEIGHT = Constants.statusBarHeight + 56;
const PADDING = 12;
const BUTTON_WIDTH = 70;
const MAX_INPUT_WIDTH = width - 2 * PADDING;
const MIN_INPUT_WIDTH = MAX_INPUT_WIDTH - BUTTON_WIDTH;

const AnimatedFriendList = Animated.createAnimatedComponent(FriendList);

export default function Friends() {
  const { colors } = useAppTheme();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);

  const { data: friends } = useProfileFriends();
  const { data: users, isPending, error } = useUsers(debouncedQuery);

  const input = useRef<TextInput>(null);
  const isFocused = useSharedValue(false);

  const inputStyle = useAnimatedStyle(() => ({
    width: withTiming(isFocused.value ? MIN_INPUT_WIDTH : MAX_INPUT_WIDTH),
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isFocused.value ? 1 : 0),
    transform: [{ translateX: withTiming(isFocused.value ? 0 : 70) }],
  }));

  const listStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isFocused.value ? 0 : 1),
  }));

  const handleFocus = () => {
    isFocused.value = true;
  };

  const handleCancel = () => {
    isFocused.value = false;
    if (input.current) {
      input.current.blur();
    }
    setQuery("");
  };

  const renderItem: ListRenderItem<User> = ({
    item: { id, firstName, lastName },
    index,
  }) => {
    return (
      <FriendItem
        id={id}
        name={`${firstName} ${lastName}`}
      />
    );
  };

  return (
    <>
      <ScreenContainer isLoading={isPending}>
        <AnimatedFriendList
          data={users}
          renderItem={renderItem}
          contentContainerStyle={{ paddingTop: HEADER_HEIGHT }}
        />
        <AnimatedFriendList
          data={friends}
          renderItem={renderItem}
          ListHeaderComponent={
            <View>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "500",
                  marginTop: 12,
                }}>
                Friends
              </Text>
            </View>
          }
          style={[
            { ...StyleSheet.absoluteFillObject, backgroundColor: "white" },
            listStyle,
          ]}
          contentContainerStyle={{ padding: 12, paddingTop: HEADER_HEIGHT }}
        />
      </ScreenContainer>
      <View style={headerStyles.container}>
        <Animated.View style={inputStyle}>
          <Input
            ref={input}
            value={query}
            placeholder="Search"
            placeholderTextColor={colors.border}
            rightIcon={
              <Ionicons
                name="search"
                size={20}
                color={colors.icon}
              />
            }
            onChangeText={setQuery}
            onFocus={handleFocus}
            style={headerStyles.search}
          />
        </Animated.View>
        <Animated.View style={buttonStyle}>
          <Pressable
            style={headerStyles.button}
            onPress={handleCancel}>
            <Text style={[headerStyles.buttonTitle, { color: colors.tint }]}>
              Cancel
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </>
  );
}

const headerStyles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    backgroundColor: "white",
    paddingHorizontal: PADDING,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  search: {
    height: 38,
    fontSize: 15,
    fontWeight: "500",
  },
  button: {
    height: 38,
    width: BUTTON_WIDTH,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonTitle: {
    fontSize: 15,
    fontWeight: "500",
  },
});
