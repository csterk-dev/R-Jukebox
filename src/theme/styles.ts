import { extendTheme, ThemeConfig } from "@chakra-ui/react";
import { accordionStyles, buttonStyles, inputStyles, menuStyles, modalStyles } from "./components";
import { colors } from "./colors";

// Supports weights 200-800
import "@fontsource-variable/assistant";

/*
 * System sets initial value.
 * App color mode is detached from system color mode changes.
 */
const config: ThemeConfig = {
  initialColorMode: "system",
  useSystemColorMode: false
}

const theme = extendTheme({
  colors,
  config,
  components: {
    Button: buttonStyles,
    Input: inputStyles,
    Accordion: accordionStyles,
    Menu: menuStyles,
    Modal: modalStyles,
    // Apply the same input styles to the select component. For further customisation, create a `selectStyles` object inside dir /components.
    Select: inputStyles
  },
  fonts: {
    heading: "'Assistant Variable', sans-serif",
    body: "'Assistant Variable', sans-serif"
  },

  styles: {
    global: {
      body: {
        bg: "neutral.100",
        color: "neutral.700"
      },
      html: {
        height: "100%"
      }
    }
  },

  fontSizes: {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
    "6xl": "3.75rem",
    "7xl": "4.5rem",
    "8xl": "6rem",
    "9xl": "8rem"
  },

  /*
   * The lato font face does not include font weights: 200, 500, 600 or 800. 
   * For more info visit https://fontsource.org/fonts/lato
   */
  fontWeights: {
    hairline: 100,
    // thin: 200,
    light: 300,
    normal: 400,
    // medium: 500,

    // semibold: 600,
    bold: 700,
    // extrabold: 800,
    black: 900
  },

  lineHeights: {
    normal: "normal",
    none: 1,
    shorter: 1.25,
    short: 1.375,
    base: 1.5,
    tall: 1.625,
    taller: "2",
    3: ".75rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    7: "1.75rem",
    8: "2rem",
    9: "2.25rem",
    10: "2.5rem"
  },

  letterSpacings: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em"
  },

  /*
   * Use the `textStyle` prop on a component to consume the style (e.g. <Text as="h1" textStyle='h1'>This is a heading</Text>).
   * When using header styles, ensure you pass the `as` prop the correct type of html element.
   */
  textStyles: {
    h1: {
      color: "red.500",
      fontSize: "24px",
      fontWeight: "500"
    },
    h2: {
      fontSize: "20px",
      fontWeight: "500"
    },
    h3: {
      color: "brown.400",
      fontSize: "18px",
      fontWeight: "500"
    },
    h4: {
      color: "neutral.400",
      fontSize: "16px",
      fontWeight: "500"
    },
    buttonText: {
      fontSize: "16px",
      fontFamily: "lato",
      fontWeight: "normal",
      textColor: "neutral.white"
    },
    inputTitle: {
      color: "neutral.400",
      fontSize: "12px"
    }
  }
});


export { theme };