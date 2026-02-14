import { defineTextStyles } from "@chakra-ui/react";

/**
 * Properties defined in a text style
 * - Font family, weight, and size
 * - Line height
 * - Letter spacing
 * - Text decoration (strikethrough and underline)
 * - Text transform (uppercase, lowercase, and capitalization)
 * 
 * @note Ideally, try to avoid semantic color token use in text styles to ensure for greater usability. 
 */
export const textStyles = defineTextStyles({
  "heading/title": {
    description: "Used for main title headings",
    value: {
      fontSize: "md",
      fontWeight: "semibold",
      textTransform: "uppercase",
      lineHeight: "normal",
      fontStyle: "normal",
      fontFamily: "heading"
    }
  },
  "heading/section": {
    description: "Used for section headings",
    value: {
      fontSize: "md",
      textTransform: "uppercase",
      lineHeight: "normal",
      fontStyle: "normal",
      fontFamily: "heading"
    }
  },
  "heading/sub-section": {
    description: "Used for sub-section headings",
    value: {
      fontSize: "sm",
      textTransform: "uppercase",
      lineHeight: "normal",
      fontStyle: "normal",
      fontFamily: "heading"
    }
  },
  "body/base": {
    description: "Used for base body text",
    value: {
      fontSize: "md",
      fontWeight: "normal",
      lineHeight: "normal",
      fontStyle: "normal",
      fontFamily: "body"
    }
  },
  "body/sub-text": {
    description: "Used for secondary/sub-text body content",
    value: {
      fontSize: "md",
      lineHeight: "normal",
      fontStyle: "normal",
      fontFamily: "body"
    }
  },
  "body/label": {
    description: "Used for body text labels",
    value: {
      fontSize: "sm",
      lineHeight: "normal",
      fontStyle: "normal",
      fontFamily: "body"
    }
  },
  "form/label": {
    description: "Used for form labels",
    value: {
      fontSize: "sm",
      textTransform: "uppercase",
      lineHeight: "normal",
      fontStyle: "normal",
      fontFamily: "body"
    }
  }
});