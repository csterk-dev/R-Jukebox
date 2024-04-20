import { BoxProps, Circle, Flex, Square } from "@chakra-ui/react";
import { FC, memo } from "react";
import { motion, Variants } from "framer-motion";
import { useWindowDimensions } from "@usesoftwareau/react-utils";


const _PageBackdrop: FC<BoxProps> = (props) => {
  const dimensions = useWindowDimensions();
  const baseBlur = "70px";
  const shapeBlur = "30px";
  const shapeOpacity = 0.75;

  /*
   * Framer motion animation variants
   * - Defines how the animation should behave
   */
  const circleVariants1: Variants = {
    initial: {
      x: 0,
      y: 0,
      backgroundColor: "#4BB7FF"
    },
    animate: {
      x: [0, -100, 0],
      y: [0, 100, 0],
      backgroundColor: ["#4BB7FF", "#353FEB", "#8F31B7"],
      transition: {
        duration: 7,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  };

  const circleVariants2: Variants = {
    initial: {
      x: 0,
      y: 0,
      backgroundColor: "#CA0030"
    },
    animate: {
      x: [0, -100, 0],
      y: [0, -100, 0],
      backgroundColor: ["#CA0030", "#CE0088", "#CC69AB", "#FDA1A4"],
      transition: {
        duration: 4,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  };

  const circleVariants3: Variants = {
    initial: {
      x: 0,
      y: 0,
      backgroundColor: "#DF4FA7"
    },
    animate: {
      x: [0, -100, 0],
      y: [0, -100, 0],
      backgroundColor: ["#DF4FA7", "#A5279D", "#6C21CC"],
      transition: {
        duration: 5,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  };

  const squareVariants1: Variants = {
    initial: {
      x: 0,
      y: 0,
      backgroundColor: "#4E34DE",
      rotate: 0
    },
    animate: {
      x: [0, -100, 0],
      y: [0, -50, 0],
      backgroundColor: ["#4E34DE", "#A616BB", "#D00289", "#B20142"],
      rotate: [0, -180, 0],
      transition: {
        duration: 20,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  };

  const squareVariants2: Variants = {
    initial: {
      x: 0,
      y: 0,
      backgroundColor: "#FE9BA1",
      rotate: 0
    },
    animate: {
      x: [0, -100, 0],
      y: [0, 150, 0],
      backgroundColor: ["#FE9BA1", "#AD43A2", "#CC2B5E", "#B901B1"],
      rotate: [0, 360, 0],
      transition: {
        duration: 30,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  };

  const squareVariants3: Variants = {
    initial: {
      x: 0,
      y: 0,
      backgroundColor: "##F8A9B4",
      rotate: 0
    },
    animate: {
      x: [0, -100, 0],
      y: [0, -100, 0],
      backgroundColor: ["##F8A9B4", "#FF9CA1", "##CE29A2"],
      rotate: [0, 90, 0],
      transition: {
        duration: 15,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  };


  return (
    <Flex
      filter={`blur(${baseBlur})`}
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
          filter: `blur(${shapeBlur})`,
          opacity: shapeOpacity
        }}
        variants={circleVariants3}
      >
        <Circle
          filter={`blur(${shapeBlur})`}
          opacity={shapeOpacity}
          // size="500px"
          size={dimensions.width / 4}
        />
      </motion.div>

      {/* Top Left Middle */}
      <motion.div
        animate="animate"
        initial="initial"
        style={{
          position: "absolute",
          bottom: 400,
          borderRadius: 180,
          filter: `blur(${shapeBlur})`,
          opacity: shapeOpacity,
          left: dimensions.width / 3
        }}
        variants={squareVariants1}
      >
        <Square
          opacity={shapeOpacity}
          // size="550px"
          size={dimensions.width / 4}
        />
      </motion.div>

      {/* Bottom Left */}
      <motion.div
        animate="animate"
        initial="initial"
        style={{
          position: "absolute",
          bottom: -20,
          left: dimensions.width / 6,
          borderRadius: 360,
          filter: `blur(${shapeBlur})`,
          opacity: shapeOpacity
        }}
        variants={circleVariants2}
      >
        <Circle
          opacity={shapeOpacity}
          size="300px"
        />
      </motion.div>

      {/* Bottom Left 2 */}
      <motion.div
        animate="animate"
        initial="initial"
        style={{
          position: "absolute",
          bottom: 50,
          left: dimensions.width / 8,
          borderRadius: 360,
          filter: `blur(${shapeBlur})`,
          opacity: shapeOpacity - 0.3
        }}
        variants={circleVariants1}
      >
        <Circle
          opacity={shapeOpacity}
          size="450px"
        />
      </motion.div>

      {/* Middle */}
      <motion.div
        animate="animate"
        initial="initial"
        style={{
          position: "absolute",
          bottom: 10,
          right: dimensions.width / 8,
          borderRadius: 270,
          filter: `blur(${shapeBlur})`,
          opacity: shapeOpacity
        }}
        variants={squareVariants2}
      >
        <Square
          filter={`blur(${shapeBlur})`}
          opacity={shapeOpacity}
          // size="450px"
          size={dimensions.width / 3}
          transform="rotate(50deg)"
        />
      </motion.div>

      {/* Bottom Middle */}
      <motion.div
        animate="animate"
        initial="initial"
        style={{
          position: "absolute",
          bottom: 0,
          left: dimensions.width / 4,
          borderRadius: 360,
          filter: `blur(${shapeBlur})`,
          opacity: shapeOpacity
        }}
        variants={circleVariants1}
      >
        <Circle
          opacity={shapeOpacity}
          size={dimensions.width / 4}
        />
      </motion.div>

      {/* Top Left */}
      <motion.div
        animate="animate"
        initial="initial"
        style={{
          position: "absolute",
          top: -20,
          right: dimensions.width / 6,
          borderRadius: 360,
          filter: `blur(${shapeBlur})`,
          opacity: shapeOpacity
        }}
        variants={circleVariants2}
      >
        <Circle
          opacity={shapeOpacity}
          size="300px"
        />
      </motion.div>

      {/* Right Middle */}
      <motion.div
        animate="animate"
        initial="initial"
        style={{
          position: "absolute",
          top: 100,
          right: dimensions.width / 18,
          borderRadius: 360,
          filter: `blur(${shapeBlur})`,
          opacity: shapeOpacity
        }}
        variants={circleVariants1}
      >
        <Circle
          opacity={shapeOpacity}
          size={dimensions.width / 4}
        />
      </motion.div>

      {/* Bottom Right */}
      <motion.div
        animate="animate"
        initial="initial"
        style={{
          position: "absolute",
          bottom: 30,
          right: dimensions.width / 11,
          borderRadius: 270,
          filter: `blur(${shapeBlur})`,
          opacity: shapeOpacity
        }}
        variants={squareVariants3}
      >
        <Square
          opacity={shapeOpacity}
          // size="300px"
          size={dimensions.width / 4}
        />
      </motion.div>

    </Flex>
  );
};
_PageBackdrop.displayName = "PageBackdrop"


/**
 * Renders a styled blured background.
 * 
 * @extends BoxProps Props to configure the backdrop container.
 * @returns {JSX.Element} The background used for the page.
 */

export const PageBackdrop = memo(_PageBackdrop);