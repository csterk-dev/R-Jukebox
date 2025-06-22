import { BoxProps } from "@chakra-ui/react";


export const layerStyles: Record<string, BoxProps> = {
  "themed-scroll": {
    _dark: {
      scrollbarColor: "rgba(255, 255, 255, 0.2) rgba(0, 0, 0, 0);"
    },
    _light: {
      scrollbarColor: "rgba(0, 0, 0, 0.2) rgba(0, 0, 0, 0);"
    }
  }
}