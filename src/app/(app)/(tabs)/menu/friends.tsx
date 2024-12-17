import { useCallback, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  FriendList,
  FriendItem,
  Input,
  ScreenContainer,
  FriendRequest,
} from "@/components";
import { useUsers } from "@/queries/users";
import { FriendRequest as FriendRequestModel, User } from "@/models";
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

  const {
    data: friends,
    refetch: refetchFriends,
    isRefetching: isRefetchingFriends,
  } = useProfileFriends();
  const {
    data: requests,
    refetch: refetchRequests,
    isRefetching: isRefetchingRequests,
  } = useFriendRequests();
  const { data: users } = useUsers(debouncedQuery);

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

  const handleFocus = useCallback(() => {
    isFocused.value = true;
  }, [isFocused]);

  const handleCancel = useCallback(() => {
    isFocused.value = false;
    if (input.current) {
      input.current.blur();
    }
    setQuery("");
  }, [isFocused]);

  const renderFriendItem: ListRenderItem<User> = useCallback(
    ({ item }) => <FriendItem user={item} />,
    [],
  );

  const renderFriendRequestItem: ListRenderItem<FriendRequestModel> =
    useCallback(({ item }) => <FriendRequest request={item} />, []);

  return (
    <>
      <View
        style={[
          headerStyles.container,
          { backgroundColor: colors.background, borderColor: colors.border },
        ]}
      >
        <Animated.View style={inputStyle}>
          <Input
            ref={input}
            value={query}
            placeholder="Search"
            placeholderTextColor={colors.border}
            rightIcon={<Ionicons name="search" size={20} color={colors.icon} />}
            onChangeText={setQuery}
            onFocus={handleFocus}
            style={headerStyles.search}
          />
        </Animated.View>
        <Animated.View style={buttonStyle}>
          <Pressable style={headerStyles.button} onPress={handleCancel}>
            <Text style={[headerStyles.buttonTitle, { color: colors.tint }]}>
              Cancel
            </Text>
          </Pressable>
        </Animated.View>
      </View>
      <ScreenContainer style={styles.container}>
        <Animated.View style={[styles.tab, tabStyle]}>
          <SegmentedControl
            values={["Friends", "Requests"]}
            selectedIndex={selectedSegmentIndex}
            backgroundColor={colors.card}
            onChange={(event) => {
              setSelectedSegmentIndex(event.nativeEvent.selectedSegmentIndex);
            }}
          />
        </Animated.View>
        <Animated.View style={friendListStyle}>
          {selectedSegmentIndex === 0 ? (
            <FriendList
              data={friends}
              renderItem={renderFriendItem}
              ListHeaderComponent={
                <View style={styles.listHeader}>
                  <Text
                    style={[styles.listHeaderTitle, { color: colors.text }]}
                  >
                    Friends
                  </Text>
                </View>
              }
              refreshing={isRefetchingFriends}
              onRefresh={refetchFriends}
            />
          ) : (
            <FlatList
              data={requests}
              renderItem={renderFriendRequestItem}
              ListHeaderComponent={
                <View style={styles.listHeader}>
                  <Text
                    style={[styles.listHeaderTitle, { color: colors.text }]}
                  >
                    Incoming Requests
                  </Text>
                </View>
              }
              keyExtractor={(item) => item.id.toString()}
              refreshing={isRefetchingRequests}
              onRefresh={refetchRequests}
            />
          )}
        </Animated.View>
        <AnimatedFriendList
          data={users}
          renderItem={renderFriendItem}
          style={[StyleSheet.absoluteFill, listStyle]}
          contentContainerStyle={{ paddingTop: HEADER_HEIGHT }}
        />
      </ScreenContainer>
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

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  tab: {
    zIndex: 2,
    marginTop: HEADER_HEIGHT,
    justifyContent: "flex-end",
    height: TAB_HEIGHT,
    paddingHorizontal: PADDING,
  },
  listHeader: {
    padding: 12,
  },
  listHeaderTitle: {
    fontSize: 22,
    fontWeight: "500",
    marginTop: 12,
  },
});
