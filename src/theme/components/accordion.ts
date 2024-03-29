import { accordionAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";


const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(accordionAnatomy.keys)


/**
 * Accordian Style Config:
 * Can be customised to provide variant style overrides and additions to the base chakra design config.
 * 
 * Note: The accordian component's anatomy comprises the following: 'root', 'container', 'button', 'panel', 'icon'.
 *       To modify the style of the input, ensure that you target the correct element in the inputs anatomy and pass in the corresponding parts styles.
 *       See https://chakra-ui.com/docs/components/accordion/theming for more info.
 */
const baseStyle = definePartsStyle({
  button: {
    _hover: {
      bg: "neutral.100"
    }
  }
})

export const accordionStyles = defineMultiStyleConfig({ baseStyle });