import { menuAnatomy } from "@chakra-ui/anatomy"
import { createMultiStyleConfigHelpers } from "@chakra-ui/react"

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(menuAnatomy.keys)


const baseStyle = definePartsStyle({
  list: {
    p: 0,
    borderRadius: "5px",
    border: "none",
    bg: "white",
    _dark: {
      bg: "neutral.700"
    }
  },
  item: {
    bg: "transparent",
    borderRadius: "5px",
    _hover: {
      bg: "neutral.50",
      _dark: {
        bg: "neutral.500"
      }
    },
    _focus: {
      bg: "neutral.50",
      _dark: {
        bg: "neutral.500"
      }
    }
  }
});

export const menuStyles = defineMultiStyleConfig({ baseStyle })