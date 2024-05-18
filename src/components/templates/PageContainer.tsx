import { Box, BoxProps } from "@chakra-ui/react";
import { FC } from "react";
import { PageBackdrop } from "components/atoms/PageBackdrop";
import { useAppState } from "state/appContext";


/**
 * Renders a styled blured background container for which children positioned on top of.
 * 
 * @extends BoxProps Props to configure the background container.
 * @returns {JSX.Element} The background used for the page.
 */
export const PageContainer: FC<BoxProps> = (props) => {
  const { isBgAnimated } = useAppState();


  return (
    <Box
      height="100vh"
      overflowX="hidden"
      position="relative"
      width="100vw"
    >
      <Box
        bg="transparent"
        height="100%"
        position="absolute"
        width="100%"
        zIndex={100}
        {...props}
      >
        {props.children}
      </Box>
      {isBgAnimated ? <PageBackdrop /> : null}
    </Box>
  )
}