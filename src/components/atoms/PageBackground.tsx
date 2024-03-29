import { Box, BoxProps, Circle, Square, useColorModeValue } from "@chakra-ui/react";
import { FC } from "react";



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
      overflow="hidden"
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

/**
 * Styled backdrop.
 * 
 * @extends BoxProps Props to configure the background container.
 * @returns {JSX.Element} The backdrop used for the page background.
 */
const Backdrop: FC<BoxProps> = (props) => {
  const baseColor = useColorModeValue("white", "#2c3e50")

  const shapeBlur = "70px";
  const shapeOpacity = 0.75;
  return (
    <Box
      bg={baseColor}
      filter="blur(70px)"
      height="100vh"
      overflow="hidden"
      position="relative"
      width="100vw"
      zIndex={1}
      {...props}
    >
      <Circle
        bg="#EE9CA7"
        filter={`blur(${shapeBlur})`}
        left={10}
        opacity={shapeOpacity}
        position="absolute"
        size="450px"
        top={150}
      />
      <Square
        bg="#753A88"
        filter={`blur(${shapeBlur})`}
        opacity={shapeOpacity}
        position="absolute"
        right={-10}
        size="300px"
        top={0}
        transform="rotate(20deg)"
      />
      <Circle
        bg="#FFC3A0"
        bottom={30}
        filter={`blur(${shapeBlur})`}
        position="absolute"
        right={70}
        size="300px"
      />
      <Square
        bg="#6DD5ED"
        bottom={10}
        filter={`blur(${shapeBlur})`}
        position="absolute"
        right={400}
        size="450px"
        transform="rotate(50deg)"
      />
      <Circle
        bg="#CC2B5E"
        bottom={400}
        filter={`blur(${shapeBlur})`}
        left={450}
        opacity={shapeOpacity}
        position="absolute"
        size="500px"
      />
    </Box>
  )
}