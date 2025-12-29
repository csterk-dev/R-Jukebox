import { Box, BoxProps, Button, IconButton, ScrollArea } from "@chakra-ui/react";
import { useTheme } from "next-themes";
import { forwardRef, useMemo } from "react";
// import { PageBackdrop } from "@atoms";
import { useAppState } from "@state";
import { Header } from "@molecules";
import { HiChevronUp } from "react-icons/hi2";

type PageContainerProps = BoxProps & {
  handleScrollToTop(): void;
  showScrollToTopButton: boolean;
}


/**
 * Renders a styled blured background container for which children positioned on top of.
 */
export const PageContainer = forwardRef<HTMLDivElement, PageContainerProps>((props, ref) => {
  const { children, showScrollToTopButton, handleScrollToTop, ...rest } = props

  const { isBgAnimated, themeSeason, showDevDebugging } = useAppState();
  const { theme } = useTheme();
  const colorMode = theme || "dark";
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
      >
        <ScrollArea.Root
          h="100%"
          position="relative"
          w="100%"
          {...rest}
          ref={ref}
        >
          <ScrollArea.Viewport>
            <ScrollArea.Content>

              <Header
                left={0}
                position="sticky"
                top={0}
                zIndex="sticky"
              />
              {children}

              {/* Regular Button (md breakpoint only) */}
              <Button
                aria-label="Scroll to the top"
                bottom={2.5}
                display={showScrollToTopButton ? {
                  base: "none",
                  md: "inline-flex"
                } : "none"}
                position="fixed"
                right={6}
                variant="primary"
                zIndex={999}
                onClick={handleScrollToTop}
              >
                Back to top
              </Button>

              {/* Icon Button (below md breakpoint) */}
              <IconButton
                aria-label="Scroll to the top"
                bottom={10}
                display={showScrollToTopButton ? {
                  base: "inline-flex",
                  md: "none"
                } : "none"}
                position="fixed"
                right={2.5}
                variant="primary"
                zIndex={999}
                onClick={handleScrollToTop}
              >
                <HiChevronUp />
              </IconButton>

            </ScrollArea.Content>

            <ScrollArea.Scrollbar>
              <ScrollArea.Thumb />
            </ScrollArea.Scrollbar>
          </ScrollArea.Viewport>
        </ScrollArea.Root>

      </Box>

      {isBgAnimated ?
        // <PageBackdrop showDevDebugging={showDevDebugging} themeSeason={themeSeason} /> :
        // TODO Temporary fix until the bg animations are refactored
        <Box
          bg={staticBg}
          height="100%"
          overflow="hidden"
          width="100%"
          zIndex={1}
        /> :
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
})
PageContainer.displayName = "PageContainer";