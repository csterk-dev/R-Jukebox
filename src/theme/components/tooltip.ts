import { defineStyle, defineStyleConfig } from "@chakra-ui/react"

// define styles for custom variant
const baseStyle = defineStyle({
  _light: {
    bg: "white",
    color: "current"
  },
  _dark: {
    bg: "neutral.500",
    color: "current"
  }
})


// export the component theme
export const tooltipStyles = defineStyleConfig({ baseStyle })