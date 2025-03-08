import { Flex, FlexProps, Icon, IconButton, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Tooltip, useColorModeValue, useDisclosure, useMediaQuery } from "@chakra-ui/react";
import { FC, KeyboardEvent, memo, useCallback, useEffect, useRef, useState } from "react";
import { HiChartBar, HiCog6Tooth, HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { VideoControls } from "components/atoms/VideoControls";
import { usePlayer } from "state/playerContext";
import { useAppState } from "state/appContext";
import { VERSION_NUM } from "constants/index";
import { SearchBarButton } from "./SearchBarButton";
import { NewUpdateModal } from "./NewUpdateModal";
import { SearchModal } from "./SearchModal";
import { SettingsModal } from "./SettingsModal";


/** In pixels. */
export const HEADER_HEIGHT = 60;



const _Header: FC<FlexProps> = (props) => {
  const { currentVideo, isPlaying, isPlayerLoading, queue, pauseResumeCurrentVideo, playVideo, isConnected, playerVolume, updatePlayerVolume, updatePlayerTimestamp, addToBottomOfQueue, addToTopOfQueue, playNextQueueItem } = usePlayer();
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
  const { isOpen: isNewUpdateOpen, onOpen: onOpenNewUpdate, onClose: onCloseNewUpdate } = useDisclosure();

  /** Used to clear the focus when the modal closes (so it doesn't highlight the button - default behaviour) */
  const finalFocusRef = useRef(null);


  useEffect(() => {
    const currentVersion = localStorage.getItem("current_version");
    if (!currentVersion || currentVersion !== VERSION_NUM) onOpenNewUpdate();
    localStorage.setItem("current_version", VERSION_NUM);

  }, [onOpenNewUpdate]);


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


  return (
    <>
      <Flex
        alignItems="center"
        as="header"
        background={headerBg}
        boxShadow="base"
        gap="5px"
        h={`${HEADER_HEIGHT}px`}
        justify="center"
        px="20px"
        w="100%"
        {...props}
      >
        {isMobile ?
          <>
            <SearchBarButton flex={1} isMobile onOpen={onOpenSearch} />
            <VideoControls
              disableBackButton={!showingCurrentVideo}
              disablePlayButton={!showingCurrentVideo}
              disableQueueButton={!queue.length}
              flex={1}
              isPlaying={isPlaying}
              pauseCurrentVideo={() => pauseResumeCurrentVideo("pause")}
              playNextQueueItem={playNextQueueItem}
              resumeCurrentVideo={() => pauseResumeCurrentVideo("resume")}
              updateCurrentVideoTime={updatePlayerTimestamp}
            />
            <IconButton
              aria-label="Open settings"
              colorScheme="brand"
              icon={<HiCog6Tooth opacity={0.9} />}
              variant="ghost"
              onClick={onOpenSettings}
            />
          </> :

          // Default view
          <>
            <VideoControls
              disableBackButton={!showingCurrentVideo}
              disablePlayButton={!showingCurrentVideo}
              disableQueueButton={!queue.length}
              flex={1}
              isPlaying={isPlaying}
              pauseCurrentVideo={() => pauseResumeCurrentVideo("pause")}
              playNextQueueItem={playNextQueueItem}
              resumeCurrentVideo={() => pauseResumeCurrentVideo("resume")}
              updateCurrentVideoTime={updatePlayerTimestamp}
            />
            <SearchBarButton flex={1} isMobile={false} onOpen={onOpenSearch} />
            <Flex
              alignItems="center"
              flex={1}
              gap="5px"
              justifyContent="center"
            >
              <Tooltip isDisabled={showingCurrentVideo || isMobile} label="You can only change volume while a video is playing.">
                <Flex
                  alignItems="center"
                  // cursor={!showingCurrentVideo ? "not-allowed" : undefined}
                  gap="5px"
                  width="155px"
                >
                  <IconButton
                    aria-label="No volume"
                    colorScheme="neutral"
                    icon={<HiSpeakerXMark />}
                    isDisabled={!showingCurrentVideo}
                    size="sm"
                    variant="ghost"
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
                    size="sm"
                    variant="ghost"
                    onClick={onClickMaxVolume}
                  />
                </Flex>
              </Tooltip>
            </Flex>
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
              variant="ghost"
              onClick={onOpenSettings}
            />
          </>
        }
      </Flex>

      <SettingsModal
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

      <NewUpdateModal isMobile={isMobile} isOpen={isNewUpdateOpen} onClose={onCloseNewUpdate} />
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