import { Flex, FlexProps, Square } from "@chakra-ui/react";
import { FC, memo } from "react";
import { motion, Variants } from "framer-motion";
import { christmasPalette, halloweenPalette, jukeboxPalette } from "theme/definitions";


type PageBackdropProps = FlexProps & {
  themeSeason: "halloween" | "christmas" | "none";
}

const _PageBackdrop: FC<PageBackdropProps> = ({ themeSeason, ...props }) => {
  applyColorPalette(themeSeason === "halloween" ? halloweenPalette : themeSeason === "christmas" ? christmasPalette : jukeboxPalette);


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
          top: 0,
          left: 0,
          borderRadius: 360,
          filter: `blur(${SHAPE_BLUR})`,
          opacity: SHAPE_OPACITY - 0.2
        }}
        variants={BG_ANIM_SHAPE_VARIANTS.circleVariants2}
      >
        <Square size="calc(100vw / 2)" />
      </motion.div>


      {/* Bottom Left Big */}
      <motion.div
        animate="animate"
        initial="initial"
        style={{
          position: "absolute",
          bottom: 50,
          left: "calc(100vw / 8)",
          borderRadius: 360,
          filter: `blur(${SHAPE_BLUR})`,
          opacity: SHAPE_OPACITY - 0.3
        }}
        variants={BG_ANIM_SHAPE_VARIANTS.circleVariants1}
      >
        <Square opacity={SHAPE_OPACITY} size="calc(100vw / 3)" />
      </motion.div>

      {/* Top right - center center */}
      <motion.div
        animate="animate"
        initial="initial"
        style={{
          position: "absolute",
          bottom: 0,
          right: -200,
          borderRadius: 360,
          filter: `blur(${SHAPE_BLUR})`,
          opacity: SHAPE_OPACITY - 0.6
        }}
        variants={BG_ANIM_SHAPE_VARIANTS.circleVariants3}
      >
        <Square size="calc(100vw / 1.5)" />
      </motion.div>

      {/* Top Middle */}
      <motion.div
        animate="animate"
        initial="initial"
        style={{
          position: "absolute",
          right: "calc(100vw / 20)",
          bottom: 400,
          borderRadius: 140,
          filter: `blur(${SHAPE_BLUR})`,
          opacity: SHAPE_OPACITY - 0.5
        }}
        variants={BG_ANIM_SHAPE_VARIANTS.squareVariants1}
      >
        <Square opacity={SHAPE_OPACITY} size="calc(100vw / 2.5)" />
      </motion.div>

      {/* Bottom Right */}
      <motion.div
        animate="animate"
        initial="initial"
        style={{
          position: "absolute",
          top: 30,
          right: "calc(100vw / 11)",
          borderRadius: 140,
          filter: `blur(${SHAPE_BLUR})`,
          opacity: SHAPE_OPACITY - 0.7
        }}
        variants={BG_ANIM_SHAPE_VARIANTS.squareVariants3}
      >
        <Square size="calc(100vw / 2.5)" />
      </motion.div>

      {/* Middle */}
      <motion.div
        animate="animate"
        initial="initial"
        style={{
          position: "absolute",
          bottom: 10,
          right: "calc(100vw / 8)",
          borderRadius: 180,
          filter: `blur(${SHAPE_BLUR})`,
          opacity: SHAPE_OPACITY - 0.35
        }}
        variants={BG_ANIM_SHAPE_VARIANTS.squareVariants2}
      >
        <Square size="calc(100vw / 2.5)" />
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



const BG_BLUR = "50px";
const SHAPE_BLUR = "20px";
// const SHAPE_BLUR = "50px";
/** Individual shape opacities are subtracted from this value 1 (100%). Set this to 0 if you want to hide all shapes */
const SHAPE_OPACITY = 1;



/** Defines how the Framer Motion animation variants should behave. */
const BG_ANIM_SHAPE_VARIANTS: Record<string, Variants> = {
  circleVariants1: {
    initial: {
      x: 0,
      y: 0,
      backgroundColor: ""
    },
    animate: {
      x: [0, 200, 0],
      y: [0, -150, 0],
      backgroundColor: [""],
      rotate: [0, 360, 0],
      opacity: [0.7, 0.6, 0.8],
      transition: {
        duration: 60,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  },
  circleVariants2: {
    initial: {
      x: 0,
      y: 0,
      backgroundColor: ""
    },
    animate: {
      x: [0, -100, 0, 100],
      y: [0, 200, -150, 100],
      backgroundColor: [""],
      rotate: [0, -270, 0],
      opacity: [0.8, 0.6, 0.9],
      transition: {
        duration: 120,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  },
  circleVariants3: {
    initial: {
      x: -200,
      y: -200,
      backgroundColor: ""
    },
    animate: {
      x: [-200, -400, -700, -300, -200],
      y: [-200, 0, 200, 100, 0, -200],
      backgroundColor: [""],
      rotate: [0, -180, 0],
      opacity: [0.6, 0.9, 0.65, 0.8],
      transition: {
        duration: 50,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  },
  squareVariants1: {
    initial: {
      x: 0,
      y: 0,
      backgroundColor: "",
      rotate: 0
    },
    animate: {
      x: [0, -100, 0],
      y: [0, -450, 0],
      backgroundColor: [""],
      rotate: [0, -180, 0],
      opacity: [0.5, 0.7, 0.6, 0.65],
      transition: {
        duration: 90,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  },
  squareVariants2: {
    initial: {
      x: 0,
      y: 0,
      backgroundColor: "",
      rotate: 0
    },
    animate: {
      x: [0, -500, 0],
      y: [0, 150, 0],
      backgroundColor: [""],
      rotate: [0, 360, 0],
      opacity: [0.75, 0.65, 0.8],
      transition: {
        duration: 60,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  },
  squareVariants3: {
    initial: {
      x: 0,
      y: 0,
      backgroundColor: "",
      rotate: 0
    },
    animate: {
      x: [0, -100, 0],
      y: [0, -100, 0],
      backgroundColor: [""],
      rotate: [0, 90, 0],
      opacity: [0.3, 0.7],
      transition: {
        duration: 45,
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
  const newVariants: any = { ...BG_ANIM_SHAPE_VARIANTS };

  Object.keys(newVariants).forEach((variant) => {
    (newVariants[variant] as CustomVariant).initial.backgroundColor = palette[variant].initial;
    (newVariants[variant] as CustomVariant).animate.backgroundColor = palette[variant].animate;
  });
};