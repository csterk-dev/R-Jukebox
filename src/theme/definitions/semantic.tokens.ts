import { defineSemanticTokens } from "@chakra-ui/react";

const brandColors = defineSemanticTokens.colors({
  contrast: {
    value: {
      _dark: "{colors.base.white}",
      _light: "{colors.base.white}"
    }
  },
  fg: {
    value: {
      _dark: "{colors.primary.300}",
      _light: "{colors.primary.700}"
    }
  },
  subtle: {
    value: {
      _dark: "{colors.primary.900}",
      _light: "{colors.primary.100}"
    }
  },
  muted: {
    value: {
      _dark: "{colors.primary.800}",
      _light: "{colors.primary.200}"
    }
  },
  emphasized: {
    value: {
      _dark: "{colors.primary.700}",
      _light: "{colors.primary.300}"
    }
  },
  solid: {
    value: {
      _dark: "{colors.primary.600}",
      _light: "{colors.primary.600}"
    }
  },
  focusRing: {
    value: {
      _dark: "{colors.primary.500}",
      _light: "{colors.primary.500}"
    }
  },
  border: {
    value: {
      _dark: "{colors.primary.400}",
      _light: "{colors.primary.500}"
    }
  }
});


const neutralColors = defineSemanticTokens.colors({
  solid: {
    value: {
      _dark: "{colors.neutral.900}",
      _light: "{colors.base.white}"
    }
  },
  contrast: {
    value: {
      _dark: "{colors.base.white}",
      _light: "{colors.neutral.700}"
    }
  },
  fg: {
    value: {
      _dark: "{colors.base.white}",
      _light: "{colors.neutral.700}"
    }
  },
  subtle: {
    value: {
      _dark: "{colors.neutral.100}",
      _light: "{colors.neutral.300}"
    }
  },
  muted: {
    value: {
      _dark: "{colors.neutral.200}",
      _light: "{colors.neutral.400}"
    }
  },
  emphasized: {
    value: {
      _dark: "{colors.neutral.300}",
      _light: "{colors.neutral.500}"
    }
  },
  focusRing: {
    value: {
      _dark: "{colors.neutral.800}",
      _light: "{colors.neutral.900}"
    }
  }
});


const borderColors = defineSemanticTokens.colors({
  solid: {
    value: {
      _dark: "{colors.neutral.400}",
      _light: "{colors.neutral.200}"
    }
  },
  error: {
    value: {
      _dark: "{colors.red.400}",
      _light: "{colors.red.500}"
    }
  },
  warning: {
    value: {
      _dark: "{colors.orange.400}",
      _light: "{colors.orange.500}"
    }
  },
  success: {
    value: {
      _dark: "{colors.green.400}",
      _light: "{colors.green.500}"
    }
  },
  info: {
    value: {
      _dark: "{colors.blue.400}",
      _light: "{colors.blue.500}"
    }
  }
});


const surfaceColors = defineSemanticTokens.colors({
  background: {
    value: {
      _dark: "{colors.neutral.900}",
      _light: "{colors.base.white}"
    }
  },
  foreground: {
    value: {
      _dark: "{colors.neutral.700}",
      _light: "{colors.base.white}"
    }
  },
  muted: {
    value: {
      _dark: "{colors.neutral.800}",
      _light: "{colors.neutral.100}"
    }
  },
  primary: {
    value: {
      _dark: "{colors.primary.900}",
      _light: "{colors.primary.100}"
    }
  },
  "foreground-transparent": {
    value: {
      _dark: "rgba(13, 15, 24, 0.75)",
      _light: "rgba(255, 255, 255, 0.8)"
    }
  },
  "primary.hover": {
    value: {
      _dark: "{colors.primary.600}",
      _light: "{colors.primary.300}"
    }
  },
  success: {
    value: {
      _dark: "{colors.green.900}",
      _light: "{colors.green.100}"
    }
  },
  "error-danger": {
    value: {
      _dark: "{colors.red.900}",
      _light: "{colors.red.100}"
    }
  },
  info: {
    value: {
      _dark: "{colors.blue.900}",
      _light: "{colors.blue.100}"
    }
  },
  warning: {
    value: {
      _dark: "{colors.yellow.900}",
      _light: "{colors.yellow.100}"
    }
  }
});


const fgColors = defineSemanticTokens.colors({
  body: {
    value: {
      _dark: "{colors.neutral.50}",
      _light: "{colors.neutral.700}"
    }
  },
  primary: {
    value: {
      _dark: "{colors.primary.300}",
      _light: "{colors.primary.700}"
    }
  },
  accent: {
    value: {
      _dark: "{colors.primary.200}",
      _light: "{colors.primary.600}"
    }
  },
  heading: {
    value: {
      _dark: "{colors.base.white}",
      _light: "{colors.neutral.700}"
    }
  },
  muted: {
    value: {
      _dark: "{colors.neutral.400}",
      _light: "{colors.neutral.600}"
    }
  },
  "error-danger": {
    value: {
      _dark: "{colors.red.200}",
      _light: "{colors.red.600}"
    }
  },
  warning: {
    value: {
      _dark: "{colors.orange.200}",
      _light: "{colors.orange.600}"
    }
  },
  success: {
    value: {
      _dark: "{colors.green.200}",
      _light: "{colors.green.600}"
    }
  },
  info: {
    value: {
      _dark: "{colors.primary.200}",
      _light: "{colors.primary.600}"
    }
  },
  online: {
    value: "{colors.green.500}"
  },
  offline: {
    value: "{colors.orange.500}"
  }
});


export const semanticTokens = defineSemanticTokens({
  colors: {
    fg: fgColors,
    border: borderColors,
    brand: brandColors,
    neutral: neutralColors,
    surface: surfaceColors
  }
});