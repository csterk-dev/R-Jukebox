/* eslint-disable no-inline-comments */
import dayjs from "dayjs";
import { getThemeSeason } from "utils/misc";

const themeSeason = getThemeSeason(dayjs());


const appColors = {
  /** Used for the default theme */
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
  /** Used for halloween/autumn colors. */
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
  /** Used for Christmas/winter colors. */
  neutralGreen: {
    white: "#FFFFFF",
    offWhite: "#F4F4F4",
    dark: "#0F1A13",
    50: "#E8ECE9", 
    100: "#DDE3DF",
    200: "#C8CEC9",
    300: "#B2B9B4",
    400: "#99A09A",
    500: "#808780",
    600: "#535653",
    700: "#414442",
    800: "#383E39",
    900: "#1F2521" 
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
    50: "#E6F7ED", 
    100: "#BCE9CE",
    200: "#8FDCAB",
    300: "#60C888",
    400: "#4AAA6F",
    500: "#3C8E5E",
    600: "#31784E",
    700: "#285F3E",
    800: "#204C32",
    900: "#193D29" 
  }
}

const bgColors = {
  purpleLight: ["#8F31B7", "#d88ff7"],
  purpleDark: ["#44337A", appColors.purple[800]],
  // purpleDark: ["#371B3F", appColors.purple[800]],
  purpleVideoContainer: appColors.neutralPurple[900],
  
  halloweenLight: [appColors.orange[300], "#e87f00"],
  halloweenDark: ["#0b0014", "#441b00"],
  halloweenDarkVideoContainer: appColors.neutralOrange[900],

  christmasLight: ["#fc5353", appColors.red[300]],
  christmasDark: [appColors.red[500], "#e5543e"],
  christmasDarkVideoContainer: appColors.neutralOrange[900]
}


/** Default shape animation color cycles for framer motion. */
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
    animate: ["#B901B1", "#CC2B5E", "#0018FB", "#AD43A2", "#353FEB"]
  },
  squareVariants3: {
    initial: "#F8A9B4",
    animate: ["#F8A9B4", "#FF9CA1", "#CE29A2", "#CE0088"]
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


/** Christmas shape animation color cycles for framer motion. */
export const christmasThemedBgColors = {
  circleVariants1: {
    initial: "#FEC200",
    animate: ["#FEC200", "#FF9CA1", "#EE9D11", "#FDA1A4"]
  },
  circleVariants2: {
    initial: "#F78608", 
    animate: ["#F78608", "#EE7111", "#E63711", "#F78608"]
  },
  circleVariants3: {
    initial: "#EE3711", 
    animate: ["#EE3711", "#E6172F", "#D20983", "#EE3711"]
  },
  squareVariants1: {
    initial: "#E6172F",
    animate: ["#E6172F", "#D20983", "#C301C5", "#E6172F", "#F78608"]
  },
  squareVariants2: {
    initial: "#D20983", 
    animate: ["#D20983", "#C301C5", "#E6172F", "#FEC200", "#F78608"]
  },
  squareVariants3: {
    initial: "#C301C5", 
    animate: ["#C301C5", "#D20983", "#F78608", "#FEC200"]
  }
};



/*
 * Base color tokens provided to chakra provider.
 */
export const colors = {
  bg: {
    light: themeSeason === "halloween" ? bgColors.halloweenLight : themeSeason === "christmas" ? bgColors.christmasLight : bgColors.purpleLight,
    dark: themeSeason === "halloween" ? bgColors.halloweenDark : themeSeason === "christmas" ? bgColors.christmasDark : bgColors.purpleDark,
    videoContainer: themeSeason === "halloween" ? bgColors.halloweenDarkVideoContainer : themeSeason === "christmas" ? bgColors.christmasDarkVideoContainer : bgColors.purpleVideoContainer
  },
  neutral: {
    ...(themeSeason === "halloween" ? appColors.neutralOrange : themeSeason === "christmas" ? appColors.neutralGreen : appColors.neutralPurple)
  },
  brand: {
    ...(themeSeason === "halloween" ? appColors.orange : themeSeason === "christmas" ? appColors.green : appColors.purple)
  }
};