import { dialogAnatomy } from "@chakra-ui/react/anatomy"
import { defineSlotRecipe } from "@chakra-ui/react"

export const dialogRecipe = defineSlotRecipe({
  slots: dialogAnatomy.keys(),
  className: "chakra-dialog",
  base: {
    content: {
      bg: "surface.foreground"
    },
    header: {
      fontSize: "md",
      py: 4,
      px: 4
    },
    title: {
      textStyle: "heading/title"
    },
    body: {
      display: "flex",
      flexDirection: "column",
      gap: 2,
      py: 2,
      px: 4
    },
    footer: {
      display: "flex",
      flexDirection: "column",
      gap: 4,
      py: 4,
      px: 4
    }
  },
  variants: {
    variant: {
      settings: {
        header: {
          fontSize: "md",
          pb: 0,
          pt: 4
        },
        body: {
          bg: "surface.foreground",
          px: 4,
          py: 2
        },
        footer: {
          flexDirection: "column",
          gap: 2,
          px: 4,
          pt: 0,
          pb: 2
        }
      },
      search: {
        content: {
          bg: {
            base: "transparent",
            _light: "transparent"
          }
        },
        body: {
          bg: "surface.foreground",
          py: 0,
          alignItems: "center",
          borderRadius: "sm",
          display: "flex",
          flexDirection: "column",
          mt: 2,
          pl: 2,
          pr: 1
        }
      }
    }
  }
})