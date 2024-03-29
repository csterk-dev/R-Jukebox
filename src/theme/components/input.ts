/* eslint-disable no-inline-comments */

/**
 * Input Style Config:
 * Provides variant style overrides and additions to the base chakra design config.
 * 
 * Note: The input component's anatomy comprises the following: 'addon', 'field', 'element'.
 *       To modify the style of the input, ensure that you target the correct element in the inputs anatomy.
 *       See https://chakra-ui.com/docs/components/input/theming for more info.
 */
export const inputStyles = {
  variants: {
    outline: {
      field: {
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
      }
    },
    filled: {
      field: {
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
      }
    },
    flushed: {
      field: {
        fontSize: "14px"
      }
    }
  },
  defaultProps: {
    size: "md", // Same as default
    variant: "flushed", // Same as default
    focusBorderColor: "yellow.500"
  }
};