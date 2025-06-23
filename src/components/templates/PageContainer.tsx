import { Box, BoxProps, useColorMode } from "@chakra-ui/react";
import { FC, useMemo } from "react";
import { PageBackdrop } from "components/atoms/PageBackdrop";
import { useAppState } from "state/appContext";
import { Header } from "components/molecules/Header";

/**
 * Renders a styled blured background container for which children positioned on top of.
 * 
 * @extends BoxProps Props to configure the background container.
 * @returns {JSX.Element} The background used for the page.
 */
export const PageContainer: FC<BoxProps> = ({ children, ...props }) => {
  const { isBgAnimated, themeSeason } = useAppState();
  const { colorMode } = useColorMode();
  const staticBg = useMemo(() => {
    return colorMode === "dark" ?
      themeSeason === "halloween" ? "url('halloween_dark_bg_static.webp') center/cover no-repeat" : themeSeason === "christmas" ? "url('christmas_dark_bg_static.webp') center/cover no-repeat" : "url('dark_bg_static.webp') center/cover no-repeat" :
      themeSeason === "halloween" ? "url('halloween_light_bg_static.webp') center/cover no-repeat" : themeSeason === "christmas" ? "url('christmas_light_bg_static.webp') center/cover no-repeat" : "url('light_bg_static.webp') center/cover no-repeat"
  }, [colorMode, themeSeason]);
  
  return (
    <Box
      height="100dvh"
      overflowX="hidden"
      position="relative"
      width="100dvw"
    >
      <Box
        bg="transparent"
        height="100%"
        position="absolute"
        width="100%"
        zIndex={100}
        {...props}
      >
        <Box
          h="100%"
          overflowY="auto"
          position="relative"
          w="100%"
        >
          <Header
            left={0}
            position="sticky"
            top={0}
            zIndex="sticky"
          />
          {children}
        </Box>
      </Box>

      {isBgAnimated ?
        <PageBackdrop themeSeason={themeSeason} /> :
        <Box
          bg={staticBg}
          height="100%"
          overflow="hidden"
          width="100%"
          zIndex={1}
        />
      }
    </Box>
  )
}