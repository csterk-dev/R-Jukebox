import { menuAnatomy } from "@chakra-ui/anatomy"
import { createMultiStyleConfigHelpers } from "@chakra-ui/react"


const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(menuAnatomy.keys)


/**
 * Menu Style Config:
 * Can be customised to provide variant style overrides and additions to the base chakra design config.
 * 
 * Note: The menu component's anatomy comprises the following: 'button', 'list', 'item', 'groupTitle', 'command', 'divider.
 *       To modify the style of the input, ensure that you target the correct element in the inputs anatomy and pass in the corresponding parts styles.
 *       See https://chakra-ui.com/docs/components/menu/theming for more info.
 */
const baseStyle = definePartsStyle({
  item: {
    color: "neutral.700",
    _hover: {
      bg: "neutral.100"
    }
  },
  groupTitle: {
    color: "neutral.700",
    textTransform: "uppercase"
  }
})


export const menuStyles = defineMultiStyleConfig({ baseStyle })