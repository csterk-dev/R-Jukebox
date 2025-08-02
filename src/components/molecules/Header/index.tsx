import { Flex, FlexProps, HStack, Icon, IconButton, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Tooltip, useColorModeValue, useDisclosure, useMediaQuery } from "@chakra-ui/react";
import { FC, KeyboardEvent, memo, useCallback, useEffect, useRef, useState } from "react";
import { HiChartBar, HiCog6Tooth, HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { VideoControls } from "./VideoControls";
import { usePlayer } from "state/playerContext";
import { useAppState } from "state/appContext";
import { SearchBarButton } from "./SearchBarButton";
import { SearchModal } from "./SearchModal";
import { SettingsModal } from "./SettingsModal/index";



/** In pixels. */
export const HEADER_HEIGHT = 60;



const _Header: FC<FlexProps> = (props) => {
  const { currentVideo, isPlaying, isPlayerLoading, queue, pauseResumeCurrentVideo, playVideo, logs, isConnected, playerVolume, updatePlayerVolume, updatePlayerTimestamp, addToBottomOfQueue, addToTopOfQueue, playNextQueueItem } = usePlayer();
  const showingCurrentVideo = !!currentVideo && !isPlayerLoading;
  const { isBgAnimated, isMobile, toggleBgAnimated } = useAppState();

  /*
   * Styling variables
   */
  const headerBg = useColorModeValue("white", "neutral.900");
  const [isLargerThan800] = useMediaQuery("(min-width: 800px)");

  /*
   * Modals
   */
  const { isOpen: isSearchOpen, onOpen: onOpenSearch, onClose: onCloseSearch } = useDisclosure();
  const { isOpen: isSettingsOpen, onOpen: onOpenSettings, onClose: onCloseSettings } = useDisclosure();


  /** Used to clear the focus when the modal closes (so it doesn't highlight the button - default behaviour) */
  const finalFocusRef = useRef(null);


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
  const [showVolumeTooltip, setShowVolumeTooltip] = useState(false);


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
        alignItems="center"
        as="header"
        background={headerBg}
        boxShadow="base"
        gap={2}
        h={`${HEADER_HEIGHT}px`}
        justify="center"
        px={5}
        w="100%"
        {...props}
      >
        {isMobile ?
          <>
            <SearchBarButton flex={1} isMobile onOpen={onOpenSearch} />
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
            <IconButton
              aria-label="Open settings"
              colorScheme="brand"
              icon={<HiCog6Tooth opacity={0.9} />}
              size="md"
              onClick={onOpenSettings}
            />
          </> :

          // Default view
          <>
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

            <SearchBarButton flex={1} isMobile={false} onOpen={onOpenSearch} />

            <HStack flex={1} justifyContent="center">
              <Tooltip isDisabled={showingCurrentVideo || isMobile} label="You can only change volume while a video is playing.">
                <HStack width="170px">
                  <IconButton
                    aria-label="No volume"
                    colorScheme="neutral"
                    icon={<HiSpeakerXMark />}
                    isDisabled={!showingCurrentVideo}
                    size="md"
                    onClick={onClickToggleMute}
                  />
                  <Slider
                    aria-label="Volume control"
                    colorScheme="brand"
                    focusThumbOnChange={false}
                    isDisabled={!showingCurrentVideo}
                    max={100}
                    min={0}
                    step={5}
                    value={localVolume}
                    variant="horizontal"
                    onChange={val => onChangeVolumeHandler(val)}
                    onChangeEnd={val => onChangeEndVolumeHandler(val)}
                    onMouseEnter={() => setShowVolumeTooltip(true)}
                    onMouseLeave={() => setShowVolumeTooltip(false)}
                  >
                    <SliderTrack>
                      <SliderFilledTrack />
                    </SliderTrack>
                    <Tooltip isOpen={showVolumeTooltip} label={`${localVolume}%`}>
                      <SliderThumb />
                    </Tooltip>
                  </Slider>
                  <IconButton
                    aria-label="Max volume"
                    colorScheme="neutral"
                    icon={<HiSpeakerWave />}
                    isDisabled={!showingCurrentVideo}
                    size="md"
                    onClick={onClickMaxVolume}
                  />
                </HStack>
              </Tooltip>
            </HStack>

            {isLargerThan800 ?
              <Tooltip isDisabled={isMobile} label={`Player ${isConnected ? "Connected" : "Offline"}`} placement="left">
                <span>
                  <Icon
                    aria-label={`${isConnected ? "Connected" : "Offline"}`}
                    as={HiChartBar}
                    color={isConnected ? "green" : "orange"}
                    mt="7px"
                  />
                </span>
              </Tooltip> :
              null
            }

            <IconButton
              aria-label="Open settings"
              icon={<HiCog6Tooth opacity={0.9} />}
              size="md"
              onClick={onOpenSettings}
            />
          </>
        }
      </Flex>

      <SettingsModal
        entryLogs={logs}
        finalFocusRef={finalFocusRef}
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

      <SearchModal
        finalFocusRef={finalFocusRef}
        handleAddToBottomOfQueue={addToBottomOfQueue}
        handleAddToTopOfQueue={addToTopOfQueue}
        handlePlayVideo={handlePlayVideo}
        isMobile={isMobile}
        isOpen={isSearchOpen}
        onClose={onCloseSearch}
      />
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