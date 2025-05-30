import { modalAnatomy as parts } from "@chakra-ui/anatomy"
import { createMultiStyleConfigHelpers } from "@chakra-ui/styled-system"

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys)

const baseStyle = definePartsStyle({
  dialog: {
    bgColor: "base.white",
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

const search = definePartsStyle({
  dialog: {
    bgColor: "transparent",
    _dark: {
      bgColor: "transparent"
    }
  },
  header: {
    ...baseStyle.header
  },
  body: {
    ...baseStyle.body,
    bgColor: "base.white",
    _dark: {
      bgColor: "neutral.700"
    }
  },
  footer: {
    ...baseStyle.footer
  }
})

export const modalStyles = defineMultiStyleConfig({
  baseStyle,
  variants: {
    search
  }
})