import { sliderAnatomy } from "@chakra-ui/react/anatomy"
import { defineSlotRecipe } from "@chakra-ui/react"

const videoProgressTransitionMs = 50;

export const sliderRecipe = defineSlotRecipe({
  className: "chakra-slider",
  slots: sliderAnatomy.keys(),
  base: {},
  variants: {
    variant: {
      volume: {
        range: {
          bg: "brand.solid"
        },
        track: {
          bg: "surface.muted"
        },
        thumb: {
          _dragging: {
            bg: "brand.fg"
          },
          bg: "brand.solid",
          border: "1px solid",
          borderColor: "surface.foreground",
          boxShadow: "2xl",
          boxShadowColor: "#000",
          width: "18px",
          height: "18px"
        }
      },
      mobileVolume: {
        range: {
          minW: "50px",
          bg: "brand.solid",
          transition: "min-width linear 0.1s",
          _dragging: {
            minW: "55px"
          }
        },
        track: {
          bg: "surface.muted",
          borderRadius: "lg",
          minW: "50px",
          h: "400px",
          transition: "min-width linear 0.1s",
          _dragging: {
            minW: "55px"
          }
        }
      },
      videoProgress: {
        root: {
          _groupHover: {
            height: "6px"
          },
          height: "4px",
          width: "100%"
        },
        track: {
          _groupHover: {
            height: "6px"
          },
          bg: "#989090",
          height: "4px",
          borderStartRadius: 0,
          borderEndRadius: 0,
          borderBottomStartRadius: 10,
          transition: `height ${videoProgressTransitionMs}ms linear`,
          borderBottomEndRadius: 10
        },
        thumb: {
          _hover: {
            scale: 1.25
          },
          transformOrigin: "center",
          transition: `scale ${videoProgressTransitionMs}ms linear`,
          bg: "#DA1413",
          width: "14px",
          height: "14px"
        },
        range: {
          _groupHover: {
            height: "6px"
          },
          transition: `height ${videoProgressTransitionMs}ms linear`,
          height: "4px",
          bg: "#DA1413"
        }
      }
    }
  }
})