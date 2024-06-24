/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColor = "#050C9C";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColor,
    icon: "#687076",
    border: "#DDDDDD",
    green: "#1CBABA",
    yellow: "#FFB700",
    red: "#F63737",
    card: "rgba(0.0, 0.0, 0.0, 0.04)",
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColor,
    icon: "#9BA1A6",
    border: "#DDDDDD",
    green: "#1CBABA",
    yellow: "#FFB700",
    red: "#F63737",
    card: "rgba(255.0, 255.0, 255.0, 0.1)",
  },
};

export const NavigationLightTheme = {
  dark: false,
  colors: {
    ...Colors.light,
    primary: Colors.light.tint,
    notification: Colors.light.background,
  },
};

export const NavigationDarkTheme = {
  dark: true,
  colors: {
    ...Colors.dark,
    primary: Colors.dark.tint,
    notification: Colors.dark.background,
  },
};
