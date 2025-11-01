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
    py: 2,
    px: 4
  },
  body: {
    display: "flex",
    bgColor: "surface.foreground",
    py: 2,
    flexDirection: "column",
    px: 4
  },
  footer: {
    display: "flex",
    flexDirection: "column",
    pt: 2,
    pb: 3,
    gap: 2,
    px: 4
  }
});

const settings = definePartsStyle({
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
});

const search = definePartsStyle({
  dialog: {
    bgColor: "transparent",
    _dark: {
      bgColor: "transparent"
    }
  },
  body: {
    bgColor: "surface.foreground",
    py: 0,
    alignItems: "center",
    borderRadius: "sm",
    display: "flex",
    flexDir: "column",
    mt: 2,
    pl: 2,
    pr: 1
  }
})

export const modalStyles = defineMultiStyleConfig({
  baseStyle,
  variants: {
    settings,
    search
  }
})