import { alertAnatomy } from "@chakra-ui/react/anatomy";
import { defineSlotRecipe } from "@chakra-ui/react";

export const alertRecipe = defineSlotRecipe({
  slots: alertAnatomy.keys(),
  className: "chakra-alert",
  base: {
    root: {
      borderRadius: "sm"
    }
  },
  variants: {
    status: {
      info: {
        root: {
          bg: "#8659EF",
          color: "#ffffff"
        }
      },
      error: {
        root: {
          bg: "#B9023A",
          color: "#ffffff"
        }
      },
      success: {
        root: {
          bg: "#00a075",
          color: "#ffffff"
        }
      }
    }
  },
  defaultVariants: {
    status: "info"
  }
})