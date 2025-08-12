

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
    default: "brand.300"
  },
  bug: {
    _light: "red.300",
    default: "red.300"
  },
  improvement: {
    _light: "yellow.500",
    default: "yellow.500"
  },
  body: {
    _light: "neutral.700",
    default: "base.white"
  },
  "on-light": {
    _light: "neutral.700",
    default: "neutral.700"
  },
  "on-dark": {
    _light: "neutral.50",
    default: "neutral.50"
  },
  inverted: {
    _light: "base.white",
    default: "neutral.700"
  }
}


const surface: SemanticToken = {
  solid: {
    _light: "base.white",
    default: "neutral.900"
  },
  foreground: {
    _light: "base.white",
    default: "neutral.700"
  },
  "foreground-transparent": {
    _light: "rgba(255, 255, 255, 0.8)",
    default: "rgba(13, 15, 24, 0.75)"
  },
  brand: {
    default: "brand.500"
  },
  "brand.hover": {
    default: "brand.600"
  }
}


const text: SemanticToken = {
  body: {
    _light: "neutral.700",
    default: "base.white"
  },
  subtle: {
    _light: "neutral.300",
    default: "neutral.100"
  },
  "on-light": {
    _light: "neutral.700",
    default: "neutral.700"
  },
  "on-dark": {
    _light: "neutral.50",
    default: "neutral.50"
  },
  inverted: {
    _light: "base.white",
    default: "neutral.700"
  },
  heading: {
    _light: "neutral.700",
    default: "base.white"
  },
  "heading-subtle": {
    _light: "neutral.300",
    default: "neutral.100"
  },
  accent: {
    _light: "brand.500",
    default: "brand.300"
  },
  focus: {
    _light: "brand.600",
    default: "brand.600"
  },
  error: {
    _light: "red.500",
    default: "red.300"
  },
  success: {
    _light: "green.500",
    default: "green.300"
  },
  warning: {
    _light: "yellow.700",
    default: "yellow.500"
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