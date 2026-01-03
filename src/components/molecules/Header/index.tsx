import { chakra, Flex, FlexProps, HStack, Icon, IconButton, Menu, Portal, Slider, Text, useDisclosure } from "@chakra-ui/react";
import { FC, KeyboardEvent, lazy, memo, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { HiChartBar, HiCog6Tooth, HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { VideoControls } from "./VideoControls";
import { useAppState, usePlayer } from "@state";
import { SearchBarButton } from "./SearchBarButton";
import { Tooltip } from "@ui";

// Dynamic imports for code splitting
const SearchModal = lazy(() => import("./SearchModal").then(module => ({ default: module.SearchModal })));
const SettingsModal = lazy(() => import("./SettingsModal/index").then(module => ({ default: module.SettingsModal })));



/** In pixels. */
export const HEADER_HEIGHT = 60;



const _Header: FC<FlexProps> = (props) => {
  const { currentVideo, isPlaying, isPlayerLoading, queue, pauseResumeCurrentVideo, playVideo, logs, isConnected, playerVolume, updatePlayerVolume, updatePlayerTimestamp, addToBottomOfQueue, addToTopOfQueue, playNextQueueItem } = usePlayer();
  const showingCurrentVideo = !!currentVideo && !isPlayerLoading;
  const { isBgAnimated, isMobile, toggleBgAnimated } = useAppState();

  /*
   * Modals
   */
  const { open: isSearchOpen, onOpen: onOpenSearch, onClose: onCloseSearch } = useDisclosure();
  const { open: isSettingsOpen, onOpen: onOpenSettings, onClose: onCloseSettings } = useDisclosure();



  /*
   * Handling to trigger the opening and closing of the search from a keyboard short cut.
   */
  useEffect(() => {
    const handleKeyDown: EventListener = (event) => {
      if ((event as unknown as KeyboardEvent).metaKey && (event as unknown as KeyboardEvent).key === "k") {
        if (!isSearchOpen) onOpenSearch();
        else onCloseSearch();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, onCloseSearch, onOpenSearch]);


  const [localVolume, setLocalVolume] = useState<number>(playerVolume);
  const prevPlayerVolume = useRef<number>();
  const beforeMuteVolume = useRef<number>();


  /** Callback to play the selected video from the search results. */
  const handlePlayVideo = useCallback((video: Video) => {
    playVideo(video);
    onCloseSearch();
  }, [onCloseSearch, playVideo]);


  /** Send the final value to the player. */
  const onChangeEndVolumeHandler = useCallback((value: number) => {
    prevPlayerVolume.current = value;
    updatePlayerVolume(value);
  }, [updatePlayerVolume]);


  /** Change handler for the volume slider to update its value locally (to allow sliding). */
  const onChangeVolumeHandler = useCallback((value: number) => {
    setLocalVolume(value);
  }, []);


  /** Sets the volume to max. */
  const onClickMaxVolume = useCallback(() => {
    if (!currentVideo) return;

    onChangeEndVolumeHandler(100);
    onChangeVolumeHandler(100);
  }, [currentVideo, onChangeEndVolumeHandler, onChangeVolumeHandler]);


  /** Toggles the volume to mute/prev val before mute. */
  const onClickToggleMute = useCallback(() => {
    if (!currentVideo) return;

    if (playerVolume !== 0) {
      beforeMuteVolume.current = playerVolume;
      onChangeEndVolumeHandler(0);
      onChangeVolumeHandler(0);
    } else if (beforeMuteVolume.current) {
      onChangeEndVolumeHandler(beforeMuteVolume.current);
      onChangeVolumeHandler(beforeMuteVolume.current);
    }
  }, [currentVideo, onChangeEndVolumeHandler, onChangeVolumeHandler, playerVolume]);


  // Resync player and local volume
  useEffect(() => {
    if (prevPlayerVolume.current !== playerVolume) {
      setLocalVolume(playerVolume);
    }
  }, [prevPlayerVolume, playerVolume]);


  /** Handles the toggling of the player playback. */
  const onPressPlayPause = useCallback(() => {
    if (!showingCurrentVideo) return;
    if (isPlaying) pauseResumeCurrentVideo("pause");
    else pauseResumeCurrentVideo("resume");
  }, [showingCurrentVideo, isPlaying, pauseResumeCurrentVideo]);


  const onPressRewindToStart = useCallback(() => updatePlayerTimestamp(0), [updatePlayerTimestamp]);


  return (
    <>
      <Flex
        as="header"
        bg="surface.background"
        boxShadow="base"
        h={`${HEADER_HEIGHT}px`}
        px={5}
        w="100%"
        {...props}
      >
        {/* Mobile */}
        <Flex
          align="center"
          gap={2}
          hideFrom="lg"
          justify="center"
          w="100%"
        >
          <Flex 
            w={{
              base: "unset",
              sm: "84px"
            }}
          >
            <SearchBarButton iconOnly onClick={onOpenSearch} />
          </Flex>
          <VideoControls
            disablePlayButton={!showingCurrentVideo}
            disableQueueButton={!queue.length}
            disableRewindButton={!showingCurrentVideo}
            flex={1}
            isPlaying={isPlaying}
            onPressPlayNextQueueItem={playNextQueueItem}
            onPressPlayPause={onPressPlayPause}
            onPressRewindToStart={onPressRewindToStart}
          />
          <HStack>
            <Menu.Root>
              <Menu.Trigger asChild>
                <IconButton 
                  aria-label="Show volume control" 
                  hideBelow="sm"
                  hideFrom="lg" 
                  size="md"
                >
                  <HiSpeakerWave />
                </IconButton>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content
                    alignItems="center"
                    display="flex"
                    flexDir="column"
                    gap={2}
                    h="200px"
                    justifyContent="center"
                    minW="50px"
                  >
                    <Text>{`${localVolume}%`}</Text>
                    <Slider.Root
                      aria-label={["Volume control"]}
                      disabled={!showingCurrentVideo}
                      h="100%"
                      max={100}
                      min={0}
                      orientation="vertical"
                      step={5}
                      value={[localVolume]}
                      variant="volume"
                      onValueChange={(e) => onChangeVolumeHandler(e.value[0])}
                      onValueChangeEnd={(e) => onChangeEndVolumeHandler(e.value[0])}
                    >
                      <Slider.Control>
                        <Slider.Track w="4px">
                          <Slider.Range />
                        </Slider.Track>

                        <Slider.Thumb index={0} />
                      </Slider.Control>
                    </Slider.Root>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
            <IconButton aria-label="Open settings" onClick={onOpenSettings}>
              <HiCog6Tooth />
            </IconButton>
          </HStack>
        </Flex>

        {/* Default */}
        <Flex
          align="center"
          gap={2}
          hideBelow="lg"
          w="100%"
        >

          <VideoControls
            disablePlayButton={!showingCurrentVideo}
            disableQueueButton={!queue.length}
            disableRewindButton={!showingCurrentVideo}
            flex={1}
            isPlaying={isPlaying}
            onPressPlayNextQueueItem={playNextQueueItem}
            onPressPlayPause={onPressPlayPause}
            onPressRewindToStart={onPressRewindToStart}
          />

          <SearchBarButton flex={1} onClick={onOpenSearch} />

          <HStack flex={1} justify="end">
            <HStack
              justifyContent="center"
              mx="auto"
              width="170px"
            >
              <IconButton
                aria-label="No volume"
                colorPalette="neutral"
                disabled={!showingCurrentVideo}
                size="md"
                onClick={onClickToggleMute}
              >
                <HiSpeakerXMark />
              </IconButton>

              <Slider.Root
                aria-label={["Volume control"]}
                disabled={!showingCurrentVideo}
                max={100}
                min={0}
                step={5}
                value={[localVolume]}
                variant="volume"
                w="100%"
                onValueChange={(e) => onChangeVolumeHandler(e.value[0])}
                onValueChangeEnd={(e) => onChangeEndVolumeHandler(e.value[0])}
              >
                <Slider.Control>
                  <Slider.Track h="4px">
                    <Slider.Range />
                  </Slider.Track>

                  <Slider.Thumb index={0}>
                    <Slider.DraggingIndicator
                      bg="surface.foreground"
                      px="1.5"
                      rounded="sm"
                      shadow="lg"
                      top="6"
                    >
                      <Slider.ValueText />
                    </Slider.DraggingIndicator>
                  </Slider.Thumb>
                </Slider.Control>
              </Slider.Root>

              <IconButton
                aria-label="Max volume"
                disabled={!showingCurrentVideo}
                size="md"
                onClick={onClickMaxVolume}
              >
                <HiSpeakerWave />
              </IconButton>
            </HStack>

            <Tooltip content={`Player ${isConnected ? "Connected" : "Offline"}`} disabled={isMobile} positioning={{ placement: "left" }}>
              <chakra.span hideBelow="md">
                <Icon color={isConnected ? "fg.online" : "fg.offline"}>
                  <HiChartBar />
                </Icon>
              </chakra.span>
            </Tooltip>
            <Menu.Root>
              <Menu.Trigger asChild>
                <IconButton aria-label="Show volume control" hideFrom="md" size="md">
                  <HiSpeakerWave />
                </IconButton>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content
                    alignItems="center"
                    display="flex"
                    flexDir="column"
                    gap={2}
                    h="200px"
                    justifyContent="center"
                    minW="50px"
                  >
                    <Text>{`${localVolume}%`}</Text>
                    <Slider.Root
                      aria-label={["Volume control"]}
                      disabled={!showingCurrentVideo}
                      h="100%"
                      max={100}
                      min={0}
                      orientation="vertical"
                      step={5}
                      value={[localVolume]}
                      variant="volume"
                      onValueChange={(e) => onChangeVolumeHandler(e.value[0])}
                      onValueChangeEnd={(e) => onChangeEndVolumeHandler(e.value[0])}
                    >
                      <Slider.Control>
                        <Slider.Track w="4px">
                          <Slider.Range />
                        </Slider.Track>

                        <Slider.Thumb index={0} />
                      </Slider.Control>
                    </Slider.Root>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
            <IconButton aria-label="Open settings" size="md" onClick={onOpenSettings}>
              <HiCog6Tooth />
            </IconButton>
          </HStack>
        </Flex>
      </Flex>

      <Suspense fallback={null}>
        <SettingsModal
          entryLogs={logs}
          isBgAnimated={isBgAnimated}
          isConnected={isConnected}
          isMobile={isMobile}
          isOpen={isSettingsOpen}
          isVolumeDisabled={!showingCurrentVideo}
          toggleBgAnimated={toggleBgAnimated}
          volumeLevel={localVolume}
          onChangeEndVolumeHandler={onChangeEndVolumeHandler}
          onChangeVolumeHandler={onChangeVolumeHandler}
          onClose={onCloseSettings}
        />
      </Suspense>

      <Suspense fallback={null}>
        <SearchModal
          handleAddToBottomOfQueue={addToBottomOfQueue}
          handleAddToTopOfQueue={addToTopOfQueue}
          handlePlayVideo={handlePlayVideo}
          isMobile={isMobile}
          isOpen={isSearchOpen}
          onClose={onCloseSearch}
        />
      </Suspense>
    </>
  )
}
_Header.displayName = "Header";

/**
 * The page header contains a search bar and app settings menu.
 * 
 * @extends FlexProps Props to configure the container.
 * @returns {JSX.Element} The page header component.
 */
export const Header = memo(_Header);