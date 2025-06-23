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

const videoProgressTransitionMs = 50;

const videoProgress = definePartsStyle({
  container: defineStyle({
    _groupHover: {
      h: "6px"
    },
    h: "4px",
    w: "100%"
  }),
  track: defineStyle({
    _groupHover: {
      h: "6px"
    },
    bgColor: "#989090",
    h: "4px",
    borderStartRadius: 0,
    borderEndRadius: 0,
    borderBottomStartRadius: 10,
    transition: `height ${videoProgressTransitionMs}ms linear`,
    borderBottomEndRadius: 10
  }),
  thumb: defineStyle({
    _hover: {
      boxSize: "18px"
    },
    transition: `box-sizing ${videoProgressTransitionMs}ms linear`,
    bgColor: "#DA1413",
    boxSize: "14px"
  }),
  filledTrack: defineStyle({
    _groupHover: {
      h: "6px"
    },
    transition: `height ${videoProgressTransitionMs}ms linear`,
    h: "4px",
    bgColor: "#DA1413"
  })
});

const vertical = definePartsStyle({
  track: defineStyle({
    borderRadius: "lg",
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