import { Link, useSegments } from "expo-router";
import { MenuItem, ScreenContainer } from "@/components";
import { useProfile } from "@/queries/profile";

export default function Menu() {
  const [, , group] = useSegments();
  const { data: user, isPending } = useProfile();
  console.log(user, { isPending });
  return (
    <ScreenContainer isLoading={isPending}>
      <Link href={`/users/${user?.id}`} asChild>
        <MenuItem
          title="Profile"
          imageSrc={require("@/../assets/images/friends.png")}
        />
      </Link>
      <Link href={`/${group}/friends`} asChild>
        <MenuItem
          title="Friends"
          imageSrc={require("@/../assets/images/friends.png")}
        />
      </Link>
      <Link href="" asChild>
        <MenuItem
          title="Chats"
          imageSrc={require("@/../assets/images/chat.png")}
        />
      </Link>
      <Link href="" asChild>
        <MenuItem
          title="Settings"
          imageSrc={require("@/../assets/images/settings.png")}
        />
      </Link>
    </ScreenContainer>
  );
}
