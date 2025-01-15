import { alertAnatomy } from "@chakra-ui/anatomy"
import { createMultiStyleConfigHelpers } from "@chakra-ui/react"
import { getThemeSeason } from "../../utils/misc";
import dayjs from "dayjs";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(alertAnatomy.keys);

const themeSeason = getThemeSeason(dayjs());


const baseStyle = definePartsStyle({
  container: {
    borderRadius: 5
  }
})

const info = definePartsStyle({
  container: {
    bg: themeSeason === "christmas" ? "#D20983" : themeSeason === "halloween" ? "#DD6B20" : "#8659EF",
    color: "#ffffff"
  }
});


const error = definePartsStyle({
  container: {
    bg: "#B9023A",
    color: "#ffffff"
  }
});


const success = definePartsStyle({
  container: {
    bg: "#00a075",
    color: "#ffffff"
  }
});


export const alertStyles = defineMultiStyleConfig({
  baseStyle,
  variants: {
    info,
    error,
    success
  },
  defaultProps: {
    variant: "info"
  }
})