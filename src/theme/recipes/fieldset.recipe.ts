import { fieldsetAnatomy } from "@chakra-ui/react/anatomy"
import { defineSlotRecipe } from "@chakra-ui/react"

export const fieldsetRecipe = defineSlotRecipe({
  className: "fieldset",
  slots: fieldsetAnatomy.keys(),
  base: {
    legend: {
      textStyle: "form/label"
    }
  }
})

