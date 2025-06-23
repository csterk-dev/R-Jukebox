/* eslint-disable no-inline-comments */
import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

// Disabled style
const disabledStyles = {
  backgroundColor: "neutral.400",
  borderColor: "neutal.400",
  color: "base.white"
};

// Base style
const baseStyle = defineStyle({
  borderRadius: "md",
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
    ghost: {},
    // Brand style
    brand: {
      bg: "neutral.500",
      color: "white",
      _hover: {
        bg: "red.500",
        color: "base.white",
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
      _dark: {
        color: "base.white",
        bg: "#8F252B"
      },
      bg: "red.600",
      color: "base.white",
      _hover: {
        _disabled: {
          ...disabledStyles
        },
        _dark: {
          bg: "red.600"
        },
        bg: "#C75650",
        color: "base.white"
      }
    }
  },
  defaultProps: {
    colorScheme: "neutral",
    size: "sm",
    variant: "ghost"
  }
});