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
  container: defineStyle({
    h: "6px",
    w: "100%"
  }),
  track: defineStyle({
    bgColor: "#989090",
    h: "6px",
    borderStartRadius: 0,
    borderEndRadius: 0,
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10
  }),
  thumb: defineStyle({
    bgColor: "#DA1413",
    boxSize: "12px"
  }),
  filledTrack: defineStyle({
    h: "8px",
    bgColor: "#DA1413"
  })
});

const vertical = definePartsStyle({
  track: defineStyle({
    borderRadius: 10,
    w: "50px",
    transition: "all linear 0.1s",
    _active: {
      w: "55px"
    }
  })
});


export const sliderStyles = defineMultiStyleConfig({
  variants: {
    horizontal,
    vertical,
    videoProgress
  }
})