import { drawerAnatomy } from "@chakra-ui/anatomy"
import { createMultiStyleConfigHelpers } from "@chakra-ui/react"


const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(drawerAnatomy.keys)


/**
 * Drawer Style Config:
 * Can be customised to provide variant style overrides and additions to the base chakra design config.
 * 
 * Note: The Drawer component's anatomy comprises the following: 'header', 'overlay', 'dialogContainer', 'dialog', 'closeButton', 'body', 'footer'.
 *       To modify the style of the drawer, ensure that you target the correct element in the inputs anatomy and pass in the corresponding parts styles.
 *       See https://chakra-ui.com/docs/components/drawer/theming for more info.
 */
const sideBar = definePartsStyle({
  dialog: {
    maxW: "240px"
  }
})


export const drawerStyles = defineMultiStyleConfig({
  variants: { sideBar }
})