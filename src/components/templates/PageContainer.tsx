import { Box, BoxProps, Flex, useColorMode } from "@chakra-ui/react";
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
  const { isBgAnimated, themeSeason } = useAppState();
  const { colorMode } = useColorMode();

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
        overflowY="auto"
        position="absolute"
        width="100%"
        zIndex={100}
        {...props}
      >
        {props.children}
      </Box>

      {isBgAnimated ?
        <PageBackdrop themeSeason={themeSeason} /> :
        <Flex
          bg={colorMode === "dark" ?
            themeSeason === "halloween" ? "url('halloween_dark_bg_static.png') center/cover no-repeat" : "url('dark_bg_static.png') center/cover no-repeat" :
            themeSeason === "halloween" ? "url('halloween_light_bg_static.png') center/cover no-repeat" : "url('light_bg_static.png') center/cover no-repeat"
          }
          height="100%"
          overflow="hidden"
          position="relative"
          width="100%"
          zIndex={1}
        />
      }
    </Box>
  )
}