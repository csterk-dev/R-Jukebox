import { sliderAnatomy as parts } from "@chakra-ui/anatomy"
import { createMultiStyleConfigHelpers, defineStyle } from "@chakra-ui/react"

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(parts.keys)


const horizontal = definePartsStyle({
  track: defineStyle({
    h: "12px"
  }),
  thumb: defineStyle({
    boxSize: "16px"
  })
});

const vertical = definePartsStyle({
  track: defineStyle({
    borderRadius: 10,
    w: "50px"
  }),
  thumb: defineStyle({
    boxSize: "54px"
  })
});


export const sliderStyles = defineMultiStyleConfig({
  variants: {
    horizontal,
    vertical
  }
})