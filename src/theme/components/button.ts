/* eslint-disable no-inline-comments */
import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

// Disabled style
const disabledStyles = {
  backgroundColor: "neutral.400",
  borderColor: "neutal.400",
  color: "neutral.white"
};

// Base style
const baseStyle = defineStyle({
  borderRadius: 5,
  textTransform: "uppercase",
  pt: "2px"
});

/**
 * Button Style Config:
 * Provides variant style overrides and additions to the base chakra design config.
 */
export const buttonStyles = defineStyleConfig({
  baseStyle,
  variants: {
    // Brand style
    brand: {
      bg: "neutral.500",
      color: "white",
      _hover: {
        bg: "red.500",
        color: "neutral.white",
        _disabled: {
          ...disabledStyles
        }
      }
    },
    // Apply custom disabled style to outline variant
    outline: {
      _hover: {
        _disabled: {
          ...disabledStyles
        }
      }
    },
    solid: {
      textTransform: "uppercase"
    },
    // Custom 'destructive' variant:
    destructive: {
      bg: "#8F252B",
      color: "neutral.white",
      _hover: {
        _disabled: {
          ...disabledStyles
        },
        bg: "#C75650",
        color: "neutral.white"
      },
      textTransform: "uppercase"
    }
  },
  defaultProps: {
    colorScheme: "neutral",
    size: "md", // Same as default
    variant: "solid" // Same as default
  }
});