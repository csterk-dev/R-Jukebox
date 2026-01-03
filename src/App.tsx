import { Flex, useDisclosure, useMediaQuery } from "@chakra-ui/react";
import { CurrentVideo } from "@atoms";
import { QueueHistoryTabs } from "@molecules";
import { PageContainer } from "@templates";
import { AppProvider, PlayerProvider } from "@state";
import { Provider, Toaster } from "@ui";
import { getDebuggingStateFromStorage } from "@utils";
import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { VERSION_NUM } from "./constants";
import "@fontsource-variable/assistant";

// Dynamic imports for code splitting
const DevScrollStateOverlay = lazy(() => import("@atoms").then(module => ({ default: module.DevScrollStateOverlay })));
const NewUpdateModal = lazy(() => import("@molecules").then(module => ({ default: module.NewUpdateModal })));


export const App = () => {
  const showDevDebugging = useMemo<boolean>(() => getDebuggingStateFromStorage(), []);

  const { open: isNewUpdateOpen, onOpen: onOpenNewUpdate, onClose: onCloseNewUpdate } = useDisclosure();

  /** Open the update modal if the user has previously used jukebox. */
  useEffect(() => {
    const currentVersion = localStorage.getItem("current_version");
    if (currentVersion && currentVersion !== VERSION_NUM) onOpenNewUpdate();

    localStorage.setItem("current_version", VERSION_NUM);
  }, [onOpenNewUpdate]);


  const pageContainerRef = useRef<HTMLDivElement>(null);
  const currentVideoContainerRef = useRef<HTMLDivElement>(null);
  const [isAtBottomOfPage, setIsAtBottomOfPage] = useState(false);
  const [isAtTopOfPage, setIsAtTopOfPage] = useState(true);
  const [isScrolledPastCurrentVideo, setIsScrolledPastCurrentVideo] = useState(false);
  /** 'lg' breakpoint value in 'em' as defined by the Chakra provider. */
  const [isLandscape] = useMediaQuery(["(min-width: 62em)"]);


  /**
   * This effect tracks the scroll state of the apps' page for pagination management within the Queue/History component.
   */
  useEffect(() => {
    const container = pageContainerRef.current;
    const currentVideoEl = currentVideoContainerRef.current;

    const handleScroll = () => {
      if (container) {
        const { scrollTop, scrollHeight, clientHeight } = container;

        /** Additional threshold for detection redundancy. */
        const threshold = 5;

        setIsAtBottomOfPage(Math.abs(scrollHeight - clientHeight - scrollTop) <= threshold);
        setIsAtTopOfPage(scrollTop <= 0);

        /**
         * Get the bottom edge of the CurrentVideo component relative to the scrollable container's top to
         * check if scrolled past CurrentVideo.
         */
        if (currentVideoEl) {
          const currentVideoBottom = currentVideoEl.offsetTop + currentVideoEl.clientHeight;
          setIsScrolledPastCurrentVideo(scrollTop > currentVideoBottom);
        }
      }
    };

    if (container) container.addEventListener("scroll", handleScroll);

    return () => {
      if (container) container.removeEventListener("scroll", handleScroll);
    };
  }, []);


  /** Scroll the page to the top when in portrait mode. */
  const handleRootScrollToTop = useCallback(() => {
    if (!isAtTopOfPage && !isLandscape) {
      currentVideoContainerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest"
      });
    }
  }, [isAtTopOfPage, isLandscape]);

  const showScrollToTopButton = !isAtTopOfPage && isScrolledPastCurrentVideo;


  return (
    <Provider>
      <AppProvider>
        <PlayerProvider>
          <Toaster />
          
          <PageContainer handleScrollToTop={handleRootScrollToTop} ref={pageContainerRef} showScrollToTopButton={showScrollToTopButton}>
            <Flex
              flexDirection={{
                base: "column",
                lg: "row"
              }}
              gap={2}
              justifyContent="space-between"
              position="relative"
              py={2.5}
            >
              <Flex
                as="article"
                flex={{
                  base: 1,
                  xl: 2,
                  "2xl": 2.5
                }}
                justifyContent="center"
                ref={currentVideoContainerRef}
                scrollMarginTop="80px"
              >
                <CurrentVideo />
              </Flex>

              <Flex
                as="aside"
                flex={1}
                justifyContent={{
                  base: "center",
                  lg: "flex-start"
                }}
              >
                <QueueHistoryTabs 
                  handleScrollToTop={handleRootScrollToTop}
                  isAtBottomOfPage={isAtBottomOfPage} 
                  isLandscape={isLandscape} 
                  setIsAtBottomOfPage={setIsAtBottomOfPage}
                />
              </Flex>
            </Flex>

            {showDevDebugging ? (
              <Suspense fallback={null}>
                <DevScrollStateOverlay
                  display="flex"
                  isAtBottomOfPage={isAtBottomOfPage}
                  isAtTopOfPage={isAtTopOfPage}
                  isLandscape={isLandscape}
                  isScrolledPastCurrentVideo={isScrolledPastCurrentVideo}
                  showScrollToTopButton={showScrollToTopButton}
                />
              </Suspense>
            ) : null}
          </PageContainer>

          {isNewUpdateOpen ? (
            <Suspense fallback={null}>
              <NewUpdateModal currentVersionNumber={VERSION_NUM as VersionNumber} isOpen={isNewUpdateOpen} onClose={onCloseNewUpdate} />
            </Suspense>
          ) : null}
          
        </PlayerProvider>
      </AppProvider>
    </Provider>
  )
}