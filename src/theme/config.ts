import { extendTheme, StyleFunctionProps, ThemeConfig } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools"
import { accordionStyles, alertStyles, buttonStyles, menuStyles, modalStyles, sliderStyles, tabStyles, tooltipStyles } from "./components";


// Supports weights 200-800
import "@fontsource-variable/assistant";
import { getThemeSeason } from "utils/misc";
import dayjs from "dayjs";
import { bgColors, colors, layerStyles, semanticTokens, textStyles } from "./definitions";


const themeSeason = getThemeSeason(dayjs());


/*
 * Dark mode by default.
 * App color mode is detached from system color mode changes.
 */
const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false
}

const theme = extendTheme({
  // Dynamically assign correct neutral colors for use in semantic tokens:
  colors: {
    neutral:
      themeSeason === "halloween" ?
        colors.neutralOrange :
        themeSeason === "christmas" ?
          colors.neutralGreen :
          colors.neutralPurple,
    brand:
      themeSeason === "halloween" ?
        colors.orange :
        themeSeason === "christmas" ?
          colors.green :
          colors.purple,
    // Supply all colors, irrespective of theme season for normal token use
    ...colors
  },
  semanticTokens,
  config,
  components: {
    Accordion: accordionStyles,
    Alert: alertStyles,
    Button: buttonStyles,
    Modal: modalStyles,
    Menu: menuStyles,
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
        bg:
          themeSeason === "halloween" ?
            mode(bgColors.halloweenLight, bgColors.halloweenDark)(props) :
            themeSeason === "christmas" ?
              mode(bgColors.christmasLight, bgColors.christmasDark)(props) :
              mode(bgColors.purpleLight, bgColors.purpleDark)(props),
        color: mode("neutral.700", "base.white")(props)
      },
      "#searchInput::-webkit-search-cancel-button": {
        display: "none"
      }
    })
  },
  layerStyles,
  textStyles
});


export { theme };