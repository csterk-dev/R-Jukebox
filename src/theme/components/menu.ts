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


const logFilters = definePartsStyle({
  list: {
    minW: "150px"
  },
  item: {
    flexDir: "row-reverse",
    pr: 0,
    pl: 2,
    _checked: {
      _dark: {
        color: "brand.200"
      },
      color: "brand.700"
    }
  },
  groupTitle: {
    mx: 0,
    pl: 2,
    textAlign: "left"
  }
});

export const menuStyles = defineMultiStyleConfig({
  baseStyle,
  variants: {
    logFilters
  }
})