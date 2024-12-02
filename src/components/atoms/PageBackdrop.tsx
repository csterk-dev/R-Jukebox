import { Circle, Flex, FlexProps, Square } from "@chakra-ui/react";
import { FC, memo } from "react";
import { motion, Variants } from "framer-motion";
import { useWindowDimensions } from "@usesoftwareau/react-utils";
import { christmasThemedBgColors, colors, halloweenThemedBgColors, purpleThemedBgColors } from "theme/colors";


type PageBackdropProps = FlexProps & {
  themeSeason: "halloween" | "christmas" | "none";
}

const _PageBackdrop: FC<PageBackdropProps> = ({ themeSeason, ...props }) => {
  const dimensions = useWindowDimensions();
  applyColorPalette(themeSeason === "halloween" ? halloweenThemedBgColors : themeSeason === "christmas" ? christmasThemedBgColors : purpleThemedBgColors);


  return (
    <Flex
      filter={`blur(${BG_BLUR})`}
      height="100%"
      overflow="hidden"
      position="relative"
      width="100%"
      zIndex={1}
      {...props}
    >
      {/* Top Left */}
      <motion.div
        animate="animate"
        initial="initial"
        style={{
          position: "absolute",
          top: 150,
          left: dimensions.width / 9,
          borderRadius: 360,
          filter: `blur(${SHAPE_BLUR})`,
          opacity: SHAPE_OPACITY
        }}
        variants={BG_ANIM_SHAPE_VARIANTS.circleVariants2}
      >
        <Circle filter={`blur(${SHAPE_BLUR})`} opacity={SHAPE_OPACITY} size={dimensions.width / 3.5} />
      </motion.div>

      {/* Bottom Left Small */}
      <motion.div
        animate="animate"
        initial="initial"
        style={{
          position: "absolute",
          bottom: -20,
          left: dimensions.width / 6,
          borderRadius: 360,
          filter: `blur(${SHAPE_BLUR})`,
          opacity: SHAPE_OPACITY
        }}
        variants={BG_ANIM_SHAPE_VARIANTS.circleVariants2}
      >
        <Circle opacity={SHAPE_OPACITY} size="400px" />
      </motion.div>

      {/* Bottom Left Big */}
      <motion.div
        animate="animate"
        initial="initial"
        style={{
          position: "absolute",
          bottom: 50,
          left: dimensions.width / 8,
          borderRadius: 360,
          filter: `blur(${SHAPE_BLUR})`,
          opacity: SHAPE_OPACITY - 0.3
        }}
        variants={BG_ANIM_SHAPE_VARIANTS.circleVariants1}
      >
        <Circle opacity={SHAPE_OPACITY} size="500px" />
      </motion.div>

      {/* Bottom Middle Left */}
      <motion.div
        animate="animate"
        initial="initial"
        style={{
          position: "absolute",
          bottom: 0,
          left: dimensions.width / 4,
          borderRadius: 360,
          filter: `blur(${SHAPE_BLUR})`,
          opacity: SHAPE_OPACITY
        }}
        variants={BG_ANIM_SHAPE_VARIANTS.circleVariants1}
      >
        <Circle opacity={SHAPE_OPACITY} size={dimensions.width / 3.5} />
      </motion.div>

      {/* Top Middle */}
      <motion.div
        animate="animate"
        initial="initial"
        style={{
          position: "absolute",
          bottom: 400,
          borderRadius: 140,
          filter: `blur(${SHAPE_BLUR})`,
          opacity: SHAPE_OPACITY,
          left: dimensions.width / 3
        }}
        variants={BG_ANIM_SHAPE_VARIANTS.squareVariants1}
      >
        <Square opacity={SHAPE_OPACITY} size={dimensions.width / 3.5} />
      </motion.div>

      {/* Top Right */}
      <motion.div
        animate="animate"
        initial="initial"
        style={{
          position: "absolute",
          top: -20,
          right: dimensions.width / 6,
          borderRadius: 360,
          filter: `blur(${SHAPE_BLUR})`,
          opacity: SHAPE_OPACITY
        }}
        variants={BG_ANIM_SHAPE_VARIANTS.circleVariants2}
      >
        <Circle opacity={SHAPE_OPACITY} size="400px" />
      </motion.div>

      {/* Middle Right */}
      <motion.div
        animate="animate"
        initial="initial"
        style={{
          position: "absolute",
          top: 100,
          right: dimensions.width / 50,
          borderRadius: 360,
          filter: `blur(${SHAPE_BLUR})`,
          opacity: SHAPE_OPACITY
        }}
        variants={BG_ANIM_SHAPE_VARIANTS.circleVariants1}
      >
        <Circle opacity={SHAPE_OPACITY} size={dimensions.width / 3.5} />
      </motion.div>

      {/* Bottom Right */}
      <motion.div
        animate="animate"
        initial="initial"
        style={{
          position: "absolute",
          bottom: 30,
          right: dimensions.width / 11,
          borderRadius: 140,
          filter: `blur(${SHAPE_BLUR})`,
          opacity: SHAPE_OPACITY
        }}
        variants={BG_ANIM_SHAPE_VARIANTS.squareVariants3}
      >
        <Square opacity={SHAPE_OPACITY} size={dimensions.width / 3.5} />
      </motion.div>


      {/* Bottom Middle right */}
      <motion.div
        animate="animate"
        initial="initial"
        style={{
          position: "absolute",
          bottom: 0,
          right: dimensions.width / 40,
          borderRadius: 360,
          filter: `blur(${SHAPE_BLUR})`,
          opacity: SHAPE_OPACITY
        }}
        variants={BG_ANIM_SHAPE_VARIANTS.circleVariants1}
      >
        <Circle opacity={SHAPE_OPACITY} size={dimensions.width / 3.5} />
      </motion.div>

      {/* Middle */}
      <motion.div
        animate="animate"
        initial="initial"
        style={{
          position: "absolute",
          bottom: 10,
          right: dimensions.width / 8,
          borderRadius: 180,
          filter: `blur(${SHAPE_BLUR})`,
          opacity: SHAPE_OPACITY
        }}
        variants={BG_ANIM_SHAPE_VARIANTS.squareVariants2}
      >
        <Square
          filter={`blur(${SHAPE_BLUR})`}
          opacity={SHAPE_OPACITY}
          size={dimensions.width / 2.5}
          transform="rotate(50deg)"
        />
      </motion.div>
    </Flex>
  );
};
_PageBackdrop.displayName = "PageBackdrop"


/**
 * Renders a styled blured background.
 * @extends BoxProps Props to configure the backdrop container.
 * @returns {JSX.Element} The background used for the page.
 */
export const PageBackdrop = memo(_PageBackdrop);



const BG_BLUR = "70px";
const SHAPE_BLUR = "30px";
const SHAPE_OPACITY = 0.75;



/** Defines how the Framer Motion animation variants should behave. */
const BG_ANIM_SHAPE_VARIANTS: Record<string, Variants> = {
  circleVariants1: {
    initial: {
      x: 0,
      y: 0,
      backgroundColor: colors.neutral[300]
    },
    animate: {
      x: [0, -100, 0],
      y: [0, 100, 0],
      backgroundColor: [colors.neutral[500]],
      transition: {
        duration: 12,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  },
  circleVariants2: {
    initial: {
      x: 0,
      y: 0,
      backgroundColor: colors.neutral[300]
    },
    animate: {
      x: [0, -100, 0],
      y: [0, -100, 0],
      backgroundColor: [colors.neutral[500]],
      transition: {
        duration: 4,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  },
  circleVariants3: {
    initial: {
      x: 0,
      y: 0,
      backgroundColor: colors.neutral[300]
    },
    animate: {
      x: [0, -100, 0],
      y: [0, -100, 0],
      backgroundColor: [colors.neutral[500]],
      transition: {
        duration: 5,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  },
  squareVariants1: {
    initial: {
      x: 0,
      y: 0,
      backgroundColor: colors.neutral[300],
      rotate: 0
    },
    animate: {
      x: [0, -100, 0],
      y: [0, -50, 0],
      backgroundColor: [colors.neutral[500]],
      rotate: [0, -180, 0],
      transition: {
        duration: 20,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  },
  squareVariants2: {
    initial: {
      x: 0,
      y: 0,
      backgroundColor: colors.neutral[300],
      rotate: 0
    },
    animate: {
      x: [0, -100, 0],
      y: [0, 150, 0],
      backgroundColor: [colors.neutral[500]],
      rotate: [0, 360, 0],
      transition: {
        duration: 30,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  },
  squareVariants3: {
    initial: {
      x: 0,
      y: 0,
      backgroundColor: colors.neutral[300],
      rotate: 0
    },
    animate: {
      x: [0, -100, 0],
      y: [0, -100, 0],
      backgroundColor: [colors.neutral[500]],
      rotate: [0, 90, 0],
      transition: {
        duration: 15,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  }
};



type BgColors = {
  [key in keyof typeof BG_ANIM_SHAPE_VARIANTS]: {
    initial: string;
    animate: string[];
  };
};

type CustomVariant = {
  initial: {
    backgroundColor: string;
  };
  animate: {
    backgroundColor: string[];
  };
};
/** Applies the provided color palette to the animated bg shape variants. */
const applyColorPalette = (palette: BgColors) => {
  const newVariants: Variants = { ...BG_ANIM_SHAPE_VARIANTS };

  Object.keys(newVariants).forEach((variant) => {
    (newVariants[variant] as CustomVariant).initial.backgroundColor = palette[variant].initial;
    (newVariants[variant] as CustomVariant).animate.backgroundColor = palette[variant].animate;
  });
};