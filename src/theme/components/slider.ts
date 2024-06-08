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


const videoProgress = definePartsStyle({
  track: defineStyle({
    bgColor: "#989090",
    h: "12px",
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10
  }),
  thumb: defineStyle({
    bgColor: "#DA1413",
    boxSize: "16px"
  }),
  filledTrack: defineStyle({
    bgColor: "#DA1413"
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
    vertical,
    videoProgress
  }
})