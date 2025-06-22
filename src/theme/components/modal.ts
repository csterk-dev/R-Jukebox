import { modalAnatomy as parts } from "@chakra-ui/anatomy"
import { createMultiStyleConfigHelpers } from "@chakra-ui/styled-system"

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys)

const baseStyle = definePartsStyle({
  dialog: {
    bgColor: "surface.foreground"
  },
  header: {
    fontSize: "md",
    px: "0px",
    py: "0px"
  },
  body: {
    px: 5,
    bgColor: "surface.foreground",
    py: 2
  },
  footer: {
    flexDirection: "column",
    gap: 2,
    px: 5,
    pt: 0,
    pb: 2
  }
})

const search = definePartsStyle({
  dialog: {
    bgColor: "transparent",
    _dark: {
      bgColor: "transparent"
    }
  },
  body: {
    ...baseStyle.body,
    alignItems: "center",
    borderRadius: 5,
    display: "flex",
    flexDir: "column",
    gap: 2,
    mt: 2,
    pl: 2,
    pr: 1
  }
})

export const modalStyles = defineMultiStyleConfig({
  baseStyle,
  variants: {
    search
  }
})