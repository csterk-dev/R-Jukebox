import { extendTheme, StyleFunctionProps, ThemeConfig } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools"
import { buttonStyles, modalStyles, tooltipStyles } from "./components";
import { colors } from "./colors";

// Supports weights 200-800
import "@fontsource-variable/assistant";
import { tabStyles } from "./components/tabs";
import { sliderStyles } from "./components/slider";

/*
 * Dark mode by default.
 * App color mode is detached from system color mode changes.
 */
const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false
}

const theme = extendTheme({
  colors,
  config,
  components: {
    Button: buttonStyles,
    Modal: modalStyles,
    Tabs: tabStyles,
    Slider: sliderStyles,
    Tooltip: tooltipStyles
  },
  fonts: {
    heading: "'Assistant Variable', sans-serif",
    body: "'Assistant Variable', sans-serif"
  },

  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        bg: mode("#DFA8F5", "#371B3F")(props),
        color: mode("neutral.700", "neutral.white")(props)
      }
    })
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

  fontWeights: {
    hairline: 100,
    thin: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900
  }
});


export { theme };