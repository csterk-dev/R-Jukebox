import { sliderAnatomy as parts } from "@chakra-ui/anatomy"
import { createMultiStyleConfigHelpers, defineStyle } from "@chakra-ui/react"
const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys)

const horizontal = definePartsStyle({
  track: defineStyle({
    h: "10px"
  }),
  thumb: defineStyle({
    boxSize: "14px"
  })
});

const vertical = definePartsStyle({
  track: defineStyle({
    w: "40px"
  }),
  thumb: defineStyle({
    boxSize: "44px"
  })
});


export const sliderStyles = defineMultiStyleConfig({
  variants: {
    horizontal,
    vertical
  }
})