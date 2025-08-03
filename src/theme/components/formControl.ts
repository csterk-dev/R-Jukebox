import { formAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";


const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(formAnatomy.keys);

const baseStyle = definePartsStyle({
  container: {
    label: {
      textStyle: "form/label"
    }
  }
});



export const formControlStyles = defineMultiStyleConfig({
  baseStyle
})