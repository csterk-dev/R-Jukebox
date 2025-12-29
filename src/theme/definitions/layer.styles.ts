import { defineLayerStyles } from "@chakra-ui/react";

export const layerStyles = defineLayerStyles({
  "themed-scroll": {
    description: "Themed scrollbar styles for dark and light modes",
    value: {
      _dark: {
        scrollbarColor: "rgba(255, 255, 255, 0.2) rgba(0, 0, 0, 0);"
      } as any,
      _light: {
        scrollbarColor: "rgba(0, 0, 0, 0.2) rgba(0, 0, 0, 0);"
      } as any
    }
  }
});