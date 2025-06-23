import { TextProps } from "@chakra-ui/react";


export const textStyles: Record<string, TextProps> = {
  "heading/title": {
    color: "text.heading",
    fontSize: "md",
    fontWeight: "semibold",
    textTransform: "uppercase"
  },
  "heading/section": {
    color: "text.heading-subtle",
    fontSize: "md",
    textTransform: "uppercase"
  },
  "heading/sub-section": {
    color: "text.heading-subtle",
    fontSize: "sm",
    textTransform: "uppercase"
  },
  "body/base": {
    color: "text.body",
    fontSize: "md",
    fontWeight: "normal"
  },
  "body/sub-text": {
    color: "text.body.subtle",
    fontSize: "md"
  },
  "body/label": {
    color: "text.body.subtle",
    fontSize: "sm"
  }
}