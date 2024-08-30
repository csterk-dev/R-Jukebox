import { modalAnatomy as parts } from "@chakra-ui/anatomy"
import { createMultiStyleConfigHelpers } from "@chakra-ui/styled-system"

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys)

const baseStyle = definePartsStyle({
  dialog: {
    bgColor: "neutral.offWhite", 
    _dark: {
      bgColor: "neutral.700"
    }
  },
  header: {
    fontSize: "16px",
    fontWeight: "600",
    px: "0px",
    py: "0px",
    textTransform: "uppercase"
  },
  body: {
    px: "20px",
    py: "10px"
  },
  footer: {
    flexDirection: "column",
    gap: "10px",
    px: "20px",
    py: "10px"
  }
})

export const modalStyles = defineMultiStyleConfig({
  baseStyle
})