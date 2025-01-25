import { StatusBar, View } from "react-native";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "@/contexts";

export const Header = ({ back, navigation }: NativeStackHeaderProps) => {
  const { colors } = useAppTheme();
  return (
    <View
      style={{
        height: 50 + (StatusBar.currentHeight ?? 0),
        backgroundColor: colors.card,
        flexDirection: "column-reverse",
      }}
    >
      <View
        style={{
          height: 50,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 12,
        }}
      >
        {back ? (
          <Ionicons.Button
            name="arrow-back"
            size={22}
            color={colors.icon}
            backgroundColor="transparent"
            underlayColor="transparent"
            style={{ marginRight: 0 }}
            onPress={navigation.goBack}
          />
        ) : null}
      </View>
    </View>
  );
};
