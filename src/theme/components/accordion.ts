import { accordionAnatomy } from "@chakra-ui/anatomy"
import { createMultiStyleConfigHelpers, defineStyle } from "@chakra-ui/react"

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(accordionAnatomy.keys)

const baseStyle = definePartsStyle({
  button: {
    borderBottomColor: "red",
    borderBottom: 1
  },
  panel: {
    borderBottomColor: "red",
    borderBottom: 1
  }
})

export const accordionStyles = defineMultiStyleConfig({
  baseStyle
});
