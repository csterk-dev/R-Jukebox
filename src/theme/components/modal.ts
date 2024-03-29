import { modalAnatomy as parts } from "@chakra-ui/anatomy"
import { createMultiStyleConfigHelpers } from "@chakra-ui/styled-system"

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys)

const baseStyle = definePartsStyle({
  header: {
    px: "0px",
    py: "0px"
  },
  body: {
    borderRadius: 5,
    px: "10px",
    py: "10px"
  },
  // Footer is contained within the body
  footer: {
    px: "0px",
    py: "10px"
  }
})

export const modalStyles = defineMultiStyleConfig({
  baseStyle
})