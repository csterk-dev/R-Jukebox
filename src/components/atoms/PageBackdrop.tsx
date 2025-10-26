import { Flex, FlexProps, Square } from "@chakra-ui/react";
import { FC, memo, useEffect, useRef, useState } from "react";
import { motion, Variants } from "framer-motion";
import { christmasPalette, halloweenPalette, jukeboxPalette } from "theme/definitions";


type PageBackdropProps = FlexProps & {
  themeSeason: "halloween" | "christmas" | "none";
  /** Container blur amount (stdDeviation) - higher = more blur */
  containerBlur?: number;
  /** Individual shape blur amount (stdDeviation) - higher = more blur */
  shapeBlur?: number;
  /** Shows/hides the console info logs. */
  showDevDebugging: boolean;
}

const _PageBackdrop: FC<PageBackdropProps> = ({ 
  themeSeason, 
  style, 
  containerBlur = BG_BLUR,
  shapeBlur = SHAPE_BLUR,
  showDevDebugging,
  ...props 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [runAnimations, setRunAnimations] = useState(false);
  
  // Create unique filter IDs to prevent caching issues
  const shapeBlurId = `shapeBlur-${shapeBlur}`;
  const containerBlurId = `containerBlur-${containerBlur}`;
  
  /**
   * Added visibility detection - animations only run when the backdrop is visible.
   * This ideally should prevent unnecessary CPU/GPU usage when the component is off-screen.
   * Supports automatic cleanup of observers on unmount.
   */
  useEffect(() => {  
    // Intersection Observer for viewport visibility
    const observer = new IntersectionObserver(
      ([entry]) => {
        setRunAnimations(entry.isIntersecting);
        showDevDebugging && console.info("PageBackdrop: observer intersecting:", entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    // Page Visibility API for tab focus detection
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      setRunAnimations(isVisible);
      showDevDebugging && console.info("PageBackdrop: tab visibility changed:", isVisible);
    };

    // Window focus/blur events as fallback
    const handleFocus = () => {
      setRunAnimations(true);
      showDevDebugging && console.info("PageBackdrop: window focused");
    };

    const handleBlur = () => {
      setRunAnimations(false);
      showDevDebugging && console.info("PageBackdrop: window blurred");
    };

    if (containerRef.current) {
      showDevDebugging && console.info("PageBackdrop: backdrop observed added")
      observer.observe(containerRef.current);
    }

    // Add event listeners
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, [showDevDebugging]);

  applyColorPalette(themeSeason === "halloween" ? halloweenPalette : themeSeason === "christmas" ? christmasPalette : jukeboxPalette);

  return (
    <>
      {/* SVG Filter Definition */}
      <svg
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          visibility: "hidden"
        }}
      >
        <defs>
          <filter
            height="200%"
            id={shapeBlurId}
            width="200%"
            x="-50%"
            y="-50%"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation={shapeBlur} />
          </filter>
          <filter
            height="200%"
            id={containerBlurId}
            width="200%"
            x="-50%"
            y="-50%"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation={containerBlur} />
          </filter>
        </defs>
      </svg>

      <Flex
        filter={`url(#${containerBlurId})`}
        height="100%"
        overflow="hidden"
        position="relative"
        ref={containerRef}
        style={{
          contain: "layout style paint",
          ...style
        }}
        width="100%"
        willChange="transform, filter"
        zIndex={1}
        {...props}
      >
        {/* Top Left */}
        <motion.div
          animate={runAnimations ? "animate" : "initial"}
          initial="initial"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            borderRadius: 360,
            filter: `url(#${shapeBlurId})`,
            opacity: SHAPE_OPACITY - 0.2,
            transform: "translate3d(0px, 0px, 0px)",
            willChange: "transform, opacity"
          }}
          variants={BG_ANIM_SHAPE_VARIANTS.circleVariants2}
        >
          <Square size="calc(100vw / 2)" />
        </motion.div>

        {/* Bottom Left Big */}
        <motion.div
          animate={runAnimations ? "animate" : "initial"}
          initial="initial"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            borderRadius: 360,
            filter: `url(#${shapeBlurId})`,
            opacity: SHAPE_OPACITY - 0.3,
            transform: "translate3d(calc(100vw / 8), -50px, 0px)",
            willChange: "transform, opacity"
          }}
          variants={BG_ANIM_SHAPE_VARIANTS.circleVariants1}
        >
          <Square opacity={SHAPE_OPACITY} size="calc(100vw / 3)" />
        </motion.div>

        {/* Top right - center center */}
        <motion.div
          animate={runAnimations ? "animate" : "initial"}
          initial="initial"
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            borderRadius: 360,
            filter: `url(#${shapeBlurId})`,
            opacity: SHAPE_OPACITY - 0.6,
            transform: "translate3d(-200px, 0px, 0px)",
            willChange: "transform, opacity"
          }}
          variants={BG_ANIM_SHAPE_VARIANTS.circleVariants3}
        >
          <Square size="calc(100vw / 4)" />
        </motion.div>

        {/* Top Middle */}
        <motion.div
          animate={runAnimations ? "animate" : "initial"}
          initial="initial"
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            borderRadius: 140,
            filter: `url(#${shapeBlurId})`,
            opacity: SHAPE_OPACITY - 0.5,
            transform: "translate3d(calc(-100vw / 20), -400px, 0px)",
            willChange: "transform, opacity"
          }}
          variants={BG_ANIM_SHAPE_VARIANTS.squareVariants1}
        >
          <Square opacity={SHAPE_OPACITY} size="calc(100vw / 3)" />
        </motion.div>

        {/* Bottom Right */}
        <motion.div
          animate={runAnimations ? "animate" : "initial"}
          initial="initial"
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            borderRadius: 140,
            filter: `url(#${shapeBlurId})`,
            opacity: SHAPE_OPACITY - 0.7,
            transform: "translate3d(calc(-100vw / 6 - 20vw), 30px, 0px)",
            willChange: "transform, opacity"
          }}
          variants={BG_ANIM_SHAPE_VARIANTS.squareVariants3}
        >
          <Square size="calc(100vw / 3)" />
        </motion.div>

        {/* Middle */}
        <motion.div
          animate={runAnimations ? "animate" : "initial"}
          initial="initial"
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            borderRadius: 180,
            filter: `url(#${shapeBlurId})`,
            opacity: SHAPE_OPACITY - 0.35,
            transform: "translate3d(calc(-100vw / 2), -10px, 0px)",
            willChange: "transform, opacity"
          }}
          variants={BG_ANIM_SHAPE_VARIANTS.squareVariants2}
        >
          <Square size="calc(100vw / 3.2)" />
        </motion.div>
      </Flex>
    </>
  );
};
_PageBackdrop.displayName = "PageBackdrop"


/**
 * Renders a styled blured background.
 * @extends BoxProps Props to configure the backdrop container.
 * @returns {JSX.Element} The background used for the page.
 */
export const PageBackdrop = memo(_PageBackdrop);



// SVG Filter blur values (stdDeviation)
// Higher values = more blur, lower values = less blur
const BG_BLUR = 50;
const SHAPE_BLUR = 20;

/** Blur presets for common use cases */
export const BLUR_PRESETS = {
  subtle: {
    containerBlur: 20,
    shapeBlur: 8
  },
  normal: {
    containerBlur: 50,
    shapeBlur: 20
  },
  heavy: {
    containerBlur: 80,
    shapeBlur: 35
  },
  extreme: {
    containerBlur: 120,
    shapeBlur: 50
  }
} as const;

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
        repeatType: "reverse" as const,
        ease: "linear"
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
        repeatType: "reverse" as const,
        ease: "linear"
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
        repeatType: "reverse" as const,
        ease: "linear"
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
        repeatType: "reverse" as const,
        ease: "linear"
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
        repeatType: "reverse" as const,
        ease: "linear"
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
      x: [0, -200, 0],
      y: [0, -5, 0],
      backgroundColor: [""],
      rotate: [0, 90, 0],
      opacity: [0.3, 0.7],
      transition: {
        duration: 45,
        repeat: Infinity,
        repeatType: "reverse" as const,
        ease: "linear"
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