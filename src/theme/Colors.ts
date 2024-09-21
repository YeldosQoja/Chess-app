export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: "#050C9C",
    icon: "#687076",
    border: "#DDDDDD",
    green: "#1CBABA",
    yellow: "#FFB700",
    red: "#F63737",
    card: "rgba(0, 0, 0, 0.04)",
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: "#BEC2FF",
    icon: "#9BA1A6",
    border: "#DDDDDD",
    green: "#1CBABA",
    yellow: "#FFB700",
    red: "#F63737",
    card: "rgba(255, 255, 255, 0.1)",
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
