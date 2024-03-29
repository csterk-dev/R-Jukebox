/* eslint-disable no-inline-comments */

/**
 * Textarea Style Config:
 * Provides variant style overrides and additions to the base chakra design config.
 * 
 * Note: The textarea is a single part component.
 *       See https://chakra-ui.com/docs/components/textarea/theming for more info.
 */
export const textareaStyles = {
  variants: {
    outline: {
      border: "1px solid",
      borderColor: "neutral.400",
      color: "neutral.700",
      fontSize: "14px",
      _hover: {
        borderColor: "neutral.800"
      },
      _focus: {
        bg: "neutral.white"
      }
    },
    filled: {
      bg: "neutral.white",
      border: "1px solid",
      color: "neutral.700",
      boxShadow: "base",
      fontSize: "14px",
      _hover: {
        bg: "neutral.white",
        border: "1px solid",
        borderColor: "neutral.300"
      },
      _focus: {
        bg: "neutral.white",
        border: "1px solid",
        borderColor: "neutral.300"
      }
    },
    flushed: {
      fontSize: "14px"
    }

  },
  defaultProps: {
    size: "md", // Same as default
    variant: "flushed", // Same as default
    focusBorderColor: "yellow.500"
  }
};