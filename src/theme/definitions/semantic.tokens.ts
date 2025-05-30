

type ColorModeToken = {
  default?: string;
  _light?: string;
  _dark?: string;
};


type SemanticToken = {
  [tokenName: string]: ColorModeToken;
};


const icon: SemanticToken = {
  info: {
    _light: "brand.300",
    _dark: "brand.300"
  },
  bug: {
    _light: "red.300",
    _dark: "red.300"
  },
  improvement: {
    _light: "yellow.500",
    _dark: "yellow.500"
  },
  body: {
    _light: "neutral.700",
    _dark: "base.white"
  },
  "on-light": {
    _light: "neutral.700",
    _dark: "neutral.700"
  },
  "on-dark": {
    _light: "neutral.50",
    _dark: "neutral.50"
  },
  inverted: {
    _light: "base.white",
    _dark: "neutral.700"
  }
}


const surface: SemanticToken = {
  solid: {
    _light: "base.white",
    _dark: "neutral.900"
  },
  foreground: {
    _light: "base.white",
    _dark: "neutral.700"
  },
  "foreground-transparent": {
    _light: "rgba(255, 255, 255, 0.8)",
    _dark: "rgba(13, 15, 24, 0.75)"
  }
}


const text: SemanticToken = {
  body: {
    _light: "neutral.700",
    _dark: "base.white"
  },
  "body.subtle": {
    _light: "neutral.300",
    _dark: "neutral.200"
  },
  "on-light": {
    _light: "neutral.700",
    _dark: "neutral.700"
  },
  "on-dark": {
    _light: "neutral.50",
    _dark: "neutral.50"
  },
  inverted: {
    _light: "base.white",
    _dark: "neutral.700"
  },
  heading: {
    _light: "brand.900",
    _dark: "brand.100"
  },
  "heading-subtle": {
    _light: "neutral.300",
    _dark: "neutral.200"
  },
  accent: {
    _light: "brand.500",
    _dark: "brand.300"
  },
  focus: {
    _light: "brand.600",
    _dark: "brand.600"
  },
  error: {
    _light: "red.500",
    _dark: "red.300"
  },
  warning: {
    _light: "yellow.700",
    _dark: "yellow.500"
  }
};



/**
 * All tokens refer only to named palettes to ensure consistency accross different themes:
 *   i.e. `"brand.<shade>"` or `"neutral.<shade>"`, plus a few
 *   hard-coded neutrals (red, yellow).
 */
export const semanticTokens = {
  colors: {
    icon: { ...icon },
    surface: { ...surface },
    text: { ...text }
  }
}