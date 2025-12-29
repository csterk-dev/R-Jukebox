import { menuAnatomy } from "@chakra-ui/react/anatomy"
import { defineSlotRecipe } from "@chakra-ui/react"

export const menuRecipe = defineSlotRecipe({
  className: "chakra-menu",
  slots: menuAnatomy.keys(),
  base: {
    content: {
      p: 0,
      borderRadius: "sm",
      border: "none",
      bg: {
        base: "neutral.700",
        _light: "white"
      }
    },
    itemGroupLabel: {
      pt: 1
    },
    item: {
      bg: "transparent",
      borderRadius: "sm",
      _highlighted: {
        bg: {
          base: "neutral.500",
          _light: "neutral.50"
        }
      }
    }
  },
  variants: {
    variant: {
      logFilters: {
        content: {
          // minW: "150px"
        },
        item: {
          // flexDirection: "row-reverse",
          pr: 0,
          pl: 2,
          _checked: {
            color: {
              base: "primary.200",
              _light: "primary.700"
            }
          }
        },
        itemGroupLabel: {
          pt: 1,
          mx: 0,
          pl: 2,
          textAlign: "left"
        }
      }
    }
  }
})