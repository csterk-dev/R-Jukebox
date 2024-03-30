import { Box, BoxProps, Circle, Flex, Square } from "@chakra-ui/react";
import { FC, memo } from "react";
import { motion, Variants } from "framer-motion";
import { useWindowDimensions } from "@usesoftwareau/react-utils";


/**
 * Renders a styled blured background container for which children positioned on top of.
 * 
 * @extends BoxProps Props to configure the background container.
 * @returns {JSX.Element} The background used for the page.
 */
export const PageBackground: FC<BoxProps> = (props) => {

  return (
    <Box
      height="100vh"
      overflowX="hidden"
      position="relative"
      width="100vw"
      {...props}
    >
      <Box
        bg="transparent"
        height="100%"
        position="absolute"
        width="100%"
        zIndex={100}
      >
        {props.children}
      </Box>
      <Backdrop />
    </Box>
  )
}

const _Backdrop: FC<BoxProps> = (props) => {
  const dimensions = useWindowDimensions();
  const baseBlur = "70px";

  const shapeBlur = "30px";
  const shapeOpacity = 0.75;

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
        duration: 60,
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
_Backdrop.displayName = "Backdrop"
const Backdrop = memo(_Backdrop);


/*
 * const _Backdrop: FC<BoxProps> = (props) => {
 *   const baseColor = useColorModeValue("white", "#2c3e50");
 */

/*
 *   const shapeBlur = "0px";
 *   const shapeOpacity = 0.75;
 */

/*
 *   const circleVariants1: Variants = {
 *     initial: {
 *       x: 0,
 *       y: 0
 *     },
 *     animate: {
 *       x: [0, -100, 0],
 *       y: [0, 100, 0],
 *       transition: {
 *         duration: 7,
 *         repeat: Infinity,
 *         repeatType: "reverse" as const
 *       }
 *     }
 *   };
 */

/*
 *   const circleVariants2: Variants = {
 *     initial: {
 *       x: 0,
 *       y: 0
 *     },
 *     animate: {
 *       x: [0, -100, 0],
 *       y: [0, -100, 0],
 *       transition: {
 *         duration: 4,
 *         repeat: Infinity,
 *         repeatType: "reverse" as const
 *       }
 *     }
 *   };
 */

/*
 *   const squareVariants1: Variants = {
 *     initial: {
 *       x: 0,
 *       y: 0
 *     },
 *     animate: {
 *       x: [0, -100, 0],
 *       y: [0, -50, 0],
 *       transition: {
 *         duration: 6,
 *         repeat: Infinity,
 *         repeatType: "reverse" as const
 *       }
 *     }
 *   };
 */

/*
 *   const squareVariants2: Variants = {
 *     initial: {
 *       x: 0,
 *       y: 0
 *     },
 *     animate: {
 *       x: [0, -100, 0],
 *       y: [0, 150, 0],
 *       transition: {
 *         duration: 10,
 *         repeat: Infinity,
 *         repeatType: "reverse" as const
 *       }
 *     }
 *   };
 */

/*
 *   return (
 *     <Box
 *       bg={baseColor}
 *       // filter="blur(70px)"
 *       height="100vh"
 *       overflow="hidden"
 *       position="relative"
 *       width="100vw"
 *       zIndex={1}
 *       {...props}
 *     >
 *       <motion.div
 *         animate="animate"
 *         initial="initial"
 *         style={{
 *           position: "absolute",
 *           top: 150,
 *           right: 10
 *         }}
 *         variants={circleVariants1}
 *       >
 *         <Circle
 *           bg="#EE9CA7"
 *           filter={`blur(${shapeBlur})`}
 *           opacity={shapeOpacity}
 *           size="450px"
 *         />
 *       </motion.div>
 */

/*
 *       <motion.div
 *         animate="animate"
 *         initial="initial"
 *         style={{
 *           position: "absolute",
 *           bottom: 400,
 *           left: 450
 *         }}
 *         variants={squareVariants1}
 *       >
 *         <Square
 *           bg="#753A88"
 *           filter={`blur(${shapeBlur})`}
 *           opacity={shapeOpacity}
 *           size="300px"
 *           transform="rotate(10deg)"
 *         />
 *       </motion.div>
 *       <motion.div
 *         animate="animate"
 *         initial="initial"
 *         style={{
 *           position: "absolute",
 *           bottom: 30,
 *           right: 70
 *         }}
 *         variants={circleVariants2}
 *       >
 *         <Circle
 *           bg="#FFC3A0"
 *           filter={`blur(${shapeBlur})`}
 *           opacity={shapeOpacity}
 *           size="300px"
 *         />
 *       </motion.div>
 *       <motion.div
 *         animate="animate"
 *         initial="initial"
 *         style={{
 *           position: "absolute",
 *           bottom: 10,
 *           right: 400
 *         }}
 *         variants={squareVariants2}
 *       >
 *         <Square
 *           bg="#6DD5ED"
 *           filter={`blur(${shapeBlur})`}
 *           opacity={shapeOpacity}
 *           size="450px"
 *           transform="rotate(50deg)"
 *         />
 *       </motion.div>
 *       <motion.div
 *         animate="animate"
 *         initial="initial"
 *         style={{
 *           position: "absolute",
 *           top: 150,
 *           left: 10
 *         }}
 *         variants={circleVariants1}
 *       >
 *         <Circle
 *           bg="#CC2B5E"
 *           filter={`blur(${shapeBlur})`}
 *           opacity={shapeOpacity}
 *           size="500px"
 *         />
 *       </motion.div>
 *     </Box>
 *   );
 * };
 * _Backdrop.displayName = "Backdrop"
 * const Backdrop = memo(_Backdrop);
 */

/**
 * Styled backdrop.
 * 
 * @extends BoxProps Props to configure the background container.
 * @returns {JSX.Element} The backdrop used for the page background.
 */
/*
 * const Backdrop: FC<BoxProps> = (props) => {
 *   const baseColor = useColorModeValue("white", "#2c3e50")
 */

/*
 *   const shapeBlur = "70px";
 *   const shapeOpacity = 0.75;
 *   return (
 *     <Box
 *       bg={baseColor}
 *       filter="blur(70px)"
 *       height="100vh"
 *       overflow="hidden"
 *       position="relative"
 *       width="100vw"
 *       zIndex={1}
 *       {...props}
 *     >
 *       <Circle
 *         bg="#EE9CA7"
 *         filter={`blur(${shapeBlur})`}
 *         left={10}
 *         opacity={shapeOpacity}
 *         position="absolute"
 *         size="450px"
 *         top={150}
 *       />
 *       <Square
 *         bg="#753A88"
 *         filter={`blur(${shapeBlur})`}
 *         opacity={shapeOpacity}
 *         position="absolute"
 *         right={-10}
 *         size="300px"
 *         top={0}
 *         transform="rotate(20deg)"
 *       />
 *       <Circle
 *         bg="#FFC3A0"
 *         bottom={30}
 *         filter={`blur(${shapeBlur})`}
 *         position="absolute"
 *         right={70}
 *         size="300px"
 *       />
 *       <Square
 *         bg="#6DD5ED"
 *         bottom={10}
 *         filter={`blur(${shapeBlur})`}
 *         position="absolute"
 *         right={400}
 *         size="450px"
 *         transform="rotate(50deg)"
 *       />
 *       <Circle
 *         bg="#CC2B5E"
 *         bottom={400}
 *         filter={`blur(${shapeBlur})`}
 *         left={450}
 *         opacity={shapeOpacity}
 *         position="absolute"
 *         size="500px"
 *       />
 *     </Box>
 *   )
 * }
 */