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
import { FriendList, FriendItem, Input, FriendRequest } from "@/components";
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
import { useProfileFriends, useFriendRequests } from "@/queries/profile";
import { useDebounce } from "@/hooks/useDebounce";
import SegmentedControl from "@react-native-segmented-control/segmented-control";

const { width } = Dimensions.get("window");

const HEADER_HEIGHT = Constants.statusBarHeight + 56;
const PADDING = 12;
const BUTTON_WIDTH = 70;
const MAX_INPUT_WIDTH = width - 2 * PADDING;
const MIN_INPUT_WIDTH = MAX_INPUT_WIDTH - BUTTON_WIDTH;
const TAB_HEIGHT = 40;

const AnimatedFriendList = Animated.createAnimatedComponent(FriendList);

export default function Friends() {
  const { colors } = useAppTheme();
  const [selectedSegmentIndex, setSelectedSegmentIndex] = useState(0);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);

  const { data: friends } = useProfileFriends();
  const { data: requests } = useFriendRequests();
  const { data: users, isPending, error } = useUsers(debouncedQuery);

  const input = useRef<TextInput>(null);
  const isFocused = useSharedValue(false);

  const inputStyle = useAnimatedStyle(() => ({
    width: withTiming(isFocused.value ? MIN_INPUT_WIDTH : MAX_INPUT_WIDTH),
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isFocused.value ? 1 : 0),
    transform: [{ translateX: withTiming(isFocused.value ? 0 : BUTTON_WIDTH) }],
  }));

  const tabStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isFocused.value ? 0 : 1),
    zIndex: withTiming(isFocused.value ? 0 : 2),
  }));

  const friendListStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isFocused.value ? 0 : 1),
    zIndex: withTiming(isFocused.value ? 0 : 1),
  }));

  const listStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isFocused.value ? 1 : 0),
    zIndex: withTiming(isFocused.value ? 1 : 0),
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

  const renderItem: ListRenderItem<User> = ({ item }) => {
    return <FriendItem user={item} />;
  };

  return (
    <>
      <View style={[headerStyles.container, { borderColor: colors.border }]}>
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
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <Animated.View
          style={[
            {
              zIndex: 2,
              marginTop: HEADER_HEIGHT,
              justifyContent: "flex-end",
              height: TAB_HEIGHT,
              paddingHorizontal: PADDING,
            },
            tabStyle,
          ]}>
          <SegmentedControl
            values={["Friends", "Requests"]}
            selectedIndex={selectedSegmentIndex}
            onChange={(event) => {
              setSelectedSegmentIndex(event.nativeEvent.selectedSegmentIndex);
            }}
          />
        </Animated.View>
        {selectedSegmentIndex === 0 ? (
          <AnimatedFriendList
            data={friends}
            renderItem={renderItem}
            ListHeaderComponent={
              <View style={{ padding: 12 }}>
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
            style={friendListStyle}
          />
        ) : (
          <Animated.FlatList
            data={requests}
            renderItem={({ item }) => <FriendRequest request={item} />}
            ListHeaderComponent={
              <View style={{ padding: 12 }}>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: "500",
                    marginTop: 12,
                  }}>
                  Incoming Requests
                </Text>
              </View>
            }
            keyExtractor={(item) => item.id.toString()}
            style={friendListStyle}
          />
        )}
        <AnimatedFriendList
          data={users}
          renderItem={renderItem}
          style={[StyleSheet.absoluteFill, listStyle]}
          contentContainerStyle={{ paddingTop: HEADER_HEIGHT }}
        />
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
    zIndex: 1,
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
