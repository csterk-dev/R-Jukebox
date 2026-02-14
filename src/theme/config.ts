import { createSystem, defaultConfig } from "@chakra-ui/react"
import { getThemeSeason } from "@utils"
import { bgColors, colors, layerStyles, semanticTokens, textStyles } from "./definitions"
import { alertRecipe, buttonRecipe, dialogRecipe, fieldsetRecipe, menuRecipe, sliderRecipe, tooltipSlotRecipe } from "./recipes"
import dayjs from "dayjs"

const themeSeason = getThemeSeason(dayjs())

// Determine which colors to use based on season
const activeNeutral =
  themeSeason === "halloween" ?
    colors.neutralOrange :
    themeSeason === "christmas" ?
      colors.neutralGreen :
      colors.neutralPurple

const activePrimary =
  themeSeason === "halloween" ?
    colors.orange :
    themeSeason === "christmas" ?
      colors.green :
      colors.purple

// Determine background based on season
const bodyBg =
  themeSeason === "halloween" ?
    {
      light: bgColors.halloweenLight,
      dark: bgColors.halloweenDark
    } :
    themeSeason === "christmas" ?
      {
        light: bgColors.christmasLight,
        dark: bgColors.christmasDark
      } :
      {
        light: bgColors.defaultLight,
        dark: bgColors.defaultDark
      }



const system = createSystem(defaultConfig, {
  globalCss: {
    "*": {
      _dark: {
        focusRingColor: "neutral.200 !important"
      },
      focusRingColor: "neutral.700 !important"
    },
    body: {
      bg: {
        _dark: bodyBg.dark,
        _light: bodyBg.light
      },
      color: {
        _dark: "{colors.neutral.50}",
        _light: "{colors.neutral.700}"
      }
    },
    "#searchInput::-webkit-search-cancel-button": {
      display: "none"
    }
  },
  theme: {
    keyframes: {
      fadeOpacity: {
        "0%, 100%": { opacity: "1" },
        "50%": { opacity: "0.75" }
      }
    },
    tokens: {
      colors: {
        base: colors.base,
        neutral: activeNeutral,
        primary: activePrimary,
        purple: colors.purple,
        orange: colors.orange,
        green: colors.green,
        red: colors.red
      },
      fonts: {
        heading: { value: "'Assistant Variable', sans-serif" },
        body: { value: "'Assistant Variable', sans-serif" }
      },
      animations: {
        fadingOpacity: { value: "fadeOpacity 1.7s ease-in-out infinite alternate" }
      }
    },
    semanticTokens,
    textStyles,
    layerStyles,
    recipes: {
      button: buttonRecipe
    },
    slotRecipes: {
      alert: alertRecipe,
      dialog: dialogRecipe,
      field: fieldsetRecipe,
      menu: menuRecipe,
      slider: sliderRecipe,
      tooltip: tooltipSlotRecipe
    }
  }
})

export { system };