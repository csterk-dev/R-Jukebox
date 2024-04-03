import { tabsAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";


const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(tabsAnatomy.keys)

/**
 * Tab Style Config:
 * Can be customised to provide variant style overrides and additions to the base chakra design config.
 * 
 * Note: The Tab component's anatomy comprises the following: 'root', 'tab', 'tablist', 'tabpanels', 'tabpanel'.
 *       To modify the style of the input, ensure that you target the correct element in the inputs anatomy and pass in the corresponding parts styles.
 *       See https://chakra-ui.com/docs/components/tabs/theming for more info.
 */
const baseStyle = definePartsStyle({
  tab: {
    _selected: {
      // bgColor: "neutral.white",
      
      // color: "neutral.800"
    }
  }
})

export const tabStyles = defineMultiStyleConfig({ baseStyle });