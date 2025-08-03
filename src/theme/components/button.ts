import { defineStyle, defineStyleConfig } from "@chakra-ui/react";


const baseStyle = defineStyle({
  borderRadius: "md",
  textTransform: "uppercase",
  pt: "2px"
});


const brandStyle = defineStyle({
  bg: "surface.brand",
  color: "text.on-dark",
  _hover: {
    bg: "surface.brand.hover"
  }
});


const destructiveStyle = defineStyle({
  bg: "red.600",
  color: "base.white",
  _hover: {
    bg: "red.700"
  }
});


/**
 * Button Style Config:
 * Provides variant style overrides and additions to the base chakra design config.
 */
export const buttonStyles = defineStyleConfig({
  baseStyle,
  variants: {
    ghost: {},
    brand: brandStyle,
    outline: {},
    solid: {},
    destructive: destructiveStyle
  },
  defaultProps: {
    colorScheme: "neutral",
    size: "sm",
    variant: "ghost"
  }
});