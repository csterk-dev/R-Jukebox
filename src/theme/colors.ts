import dayjs from "dayjs";
import { getThemeSeason } from "utils/misc";

const themeSeason = getThemeSeason(dayjs());


const appColors = {
  neutralPurple: {
    white: "#FFFFFF",
    offWhite: "#f4f4f4",
    dark: "#0d0f18",
    50: "#e5e5e7",
    100: "#bebfc4",
    200: "#92949d",
    300: "#666975",
    400: "#464958",
    500: "#25293a",
    600: "#212434",
    700: "#1b1f2c",
    800: "#161925",
    900: "#0d0f18"
  },
  neutralOrange: {
    white: "#FFFFFF",
    offWhite: "#F4F4F4",
    dark: "#2b201a",
    50: "#c4bcb4", 
    100: "#aa9b8d", 
    200: "#96826f", 
    300: "#7c6148", 
    400: "#66492e",
    500: "#513f2d",
    600: "#473220",
    700: "#2b1f13",
    800: "#211204",
    900: "#0f0801"
  },
  purple: {
    50: "#FAF5FF",
    100: "#E9D8FD",
    200: "#D6BCFA",
    300: "#B794F4",
    400: "#9F7AEA",
    500: "#805AD5",
    600: "#6B46C1",
    700: "#553C9A",
    800: "#44337A",
    900: "#322659"
  },
  orange: {
    50: "#FFFAF0",
    100: "#FEEBC8",
    200: "#FBD38D",
    300: "#F6AD55",
    400: "#ED8936",
    500: "#DD6B20",
    600: "#C05621",
    700: "#9C4221",
    800: "#7B341E",
    900: "#652B19"
  },
  red: {
    50: "#FFF5F5",
    100: "#FED7D7",
    200: "#FEB2B2",
    300: "#FC8181",
    400: "#F56565",
    500: "#E53E3E",
    600: "#C53030",
    700: "#9B2C2C",
    800: "#822727",
    900: "#63171B"
  },
  green: {
    50: "#F0FFF4",
    100: "#C6F6D5",
    200: "#9AE6B4",
    300: "#68D391",
    400: "#48BB78",
    500: "#38A169",
    600: "#2F855A",
    700: "#276749",
    800: "#22543D",
    900: "#1C4532"
  }
}

const bgColors = {
  // "#CB70DF", "#DFA8F5" - unused bg light colors
  purpleLight: "#d88ff7", 
  purpleDark: "#371B3F",
  purpleVideoContainer: appColors.neutralPurple[900],
  halloweenLight: appColors.orange[300],
  halloweenDark: "#0b0014",
  halloweenDarkVideoContainer: appColors.neutralOrange[900]
}


/** Halloween shape animation color cycles for framer motion. */
export const purpleThemedBgColors = {
  circleVariants1: {
    initial: "#6C21CC",
    animate: ["#6C21CC", "#353FEB", "#0018FB", "#8F31B7"]
  },
  circleVariants2: {
    initial: "#CA0030",
    animate: ["#CA0030", "#CE0088", "#CC69AB", "#FDA1A4"]
  },
  circleVariants3: {
    initial: "#DF4FA7",
    animate: ["#DF4FA7", "#A5279D", "#6C21CC"]
  },
  squareVariants1: {
    initial: "#4E34DE",
    animate: ["#4E34DE", "#A616BB", "#D00289", "#B20142"]
  },
  squareVariants2: {
    initial: "#B901B1",
    animate: ["#B901B1", "#AD43A2", "#CC2B5E"]
  },
  squareVariants3: {
    initial: "#F8A9B4",
    animate: ["#F8A9B4", "#FF9CA1", "#CE29A2"]
  }
};


/** Halloween shape animation color cycles for framer motion. */
export const halloweenThemedBgColors = {
  circleVariants1: {
    initial: "#FF5A01",
    animate: ["#FF6700", "#FF8811", "#FFA700", "#FF5A01"]
  },
  circleVariants2: {
    initial: "#8A0815",
    animate: ["#8A0815", "#B20B21", "#D40E2D", "#F61139"]
  },
  circleVariants3: {
    initial: "#C34421",
    animate: ["#C34421", "#E55A3C", "#FF7057", "#FF8672"]
  },
  squareVariants1: {
    initial: "#9B1018",
    animate: ["#9B1018", "#8E0812", "#C42A1B", "#D4451B", "#EF6C21"]
  },
  squareVariants2: {
    initial: "#FF5A01",
    animate: ["#FF5A01", "#ba166d", "#D00289", "#B20142", "#861510"]
  },
  squareVariants3: {
    initial: "#FCA426",
    animate: ["#F1832C", "#D55D2A", "#B44B2C", "#FCA426"]
  }
};


/*
 * Base color tokens provided to chakra provider.
 */
export const colors = {
  bg: {
    light: themeSeason === "halloween" ? bgColors.halloweenLight : bgColors.purpleLight,
    dark: themeSeason === "halloween" ? bgColors.halloweenDark : bgColors.purpleDark,
    videoContainer: themeSeason === "halloween" ? bgColors.halloweenDarkVideoContainer : bgColors.purpleVideoContainer
  },
  neutral: {
    ...(themeSeason === "halloween" ? appColors.neutralOrange : appColors.neutralPurple)
  },
  brand: {
    ...(themeSeason === "halloween" ? appColors.orange : appColors.purple)
  }
};