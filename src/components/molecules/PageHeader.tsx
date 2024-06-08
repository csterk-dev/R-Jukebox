import { Box, BoxProps, Divider, Flex, FlexProps, HStack, Icon, IconButton, Input, InputGroup, InputLeftElement, InputRightElement, Kbd, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Progress, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Spacer, Text, Tooltip, useColorModeValue, useDisclosure, VStack } from "@chakra-ui/react";
import { FC, KeyboardEvent, memo, useCallback, useEffect, useRef, useState } from "react";
import { HiChartBar, HiChevronLeft, HiCog6Tooth, HiMagnifyingGlass, HiOutlineRocketLaunch, HiRocketLaunch, HiSpeakerWave, HiSpeakerXMark, HiXMark } from "react-icons/hi2";
import { ColorModeSwitcher } from "../atoms/ColorModeSwitcher";
import { VideoCard } from "components/atoms/VideoCard";
import { VideoControls } from "components/atoms/VideoControls";
import { useDebounce } from "@usesoftwareau/react-utils";
import { useYoutubeSearch } from "utils/hooks";
import { usePlayer } from "state/playerContext";
import { useAppState } from "state/appContext";


const NUM_OF_RESULTS = 40;


const _PageHeader: FC<FlexProps> = (props) => {
  const { currentVideo, isPlaying, resumeCurrentVideo, pauseCurrentVideo, playVideo, isConnected, playerVolume, updatePlayerVolume } = usePlayer();
  const { isBgAnimated, isMobile, toggleBgAnimated } = useAppState();

  /*
   * Styling variables
   */
  const headerBg = useColorModeValue("white", "neutral.900");
  const foreground = useColorModeValue("white", "neutral.700");
  const modalBg = useColorModeValue("neutral.offWhite", "neutral.700");


  /*
   * Modals
   */
  /** Used to clear the focus when the modal closes (so it doesn't highlight the button - default behaviour) */
  const finalFocusRef = useRef(null);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const { isOpen: isSearchOpen, onOpen: onOpenSearch, onClose: onCloseSearch } = useDisclosure();
  const { isOpen: isSettingsOpen, onOpen: onOpenSettings, onClose: _onCloseSettings } = useDisclosure();
  const onCloseSettings = useCallback(() => {
    _onCloseSettings();
    setShowVolumeSlider(false);
  }, [_onCloseSettings]);
  const onPressShowVolumeSlider = useCallback(() => setShowVolumeSlider(true), []);
  const onPressHideVolumeSlider = useCallback(() => setShowVolumeSlider(false), []);


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


  /*
   * Search and Volume states
   */
  const [searchVal, setSearchVal] = useState<string>("");
  const query = useDebounce(searchVal, 1000);
  const { error, loading, videos } = useYoutubeSearch(query, NUM_OF_RESULTS);

  const [localVolume, setLocalVolume] = useState<number>(playerVolume);
  const prevPlayerVolume = useRef<number>();
  const beforeMuteVolume = useRef<number>();
  const [showVolumeTooltip, setShowVolumeTooltip] = useState(false);


  /** Clears the input if there is a value otherwise closes the modal. */
  const onClickXButton = useCallback(() => {
    if (!searchVal) return onCloseSearch();
    setSearchVal("");
  }, [onCloseSearch, searchVal]);


  /** Callback that plays the card youtube video. */
  const onClickCard = useCallback((video: Video) => {
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
      console.log(beforeMuteVolume.current);
    } else if (beforeMuteVolume.current) {
      console.log(beforeMuteVolume.current);
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
      <header>
        <Flex
          alignItems="center"
          background={headerBg}
          boxShadow="base"
          gap="5px"
          justify="center"
          px="20px"
          width="100%"
          {...props}
        >
          {isMobile ?
            <>
              <SearchBarBox flex={1} isMobile onOpen={onOpenSearch} />
              <VideoControls 
                currentVideo={currentVideo} 
                flex={1}
                isPlaying={isPlaying}
                pauseCurrentVideo={pauseCurrentVideo}
                resumeCurrentVideo={resumeCurrentVideo}
              />
              <IconButton
                aria-label="Open settings"
                colorScheme="purple"
                icon={<HiCog6Tooth opacity={0.9} />}
                variant="ghost"
                onClick={onOpenSettings}
              />
            </> :

            // Default view
            <>
              <VideoControls 
                currentVideo={currentVideo} 
                flex={1}
                isPlaying={isPlaying}
                pauseCurrentVideo={pauseCurrentVideo}
                resumeCurrentVideo={resumeCurrentVideo}
              />
              <SearchBarBox flex={1} isMobile={false} onOpen={onOpenSearch} />
              <Flex
                alignItems="center"
                flex={1}
                gap="5px"
                justifyContent="center"
              >
                <Flex
                  alignItems="center"
                  cursor={!currentVideo ? "not-allowed" : undefined}
                  gap="5px"
                  width="155px"
                >
                  <IconButton
                    aria-label="No volume"
                    colorScheme="neutral"
                    icon={<HiSpeakerXMark />}
                    isDisabled={!currentVideo}
                    size="sm"
                    variant="ghost"
                    onClick={onClickToggleMute}
                  />
                  <Slider
                    aria-label="Volume control"
                    colorScheme="purple"
                    focusThumbOnChange={false}
                    isDisabled={!currentVideo}
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
                    isDisabled={!currentVideo}
                    size="sm"
                    variant="ghost"
                    onClick={onClickMaxVolume}
                  />
                </Flex>
              </Flex>
              <IconButton
                aria-label="Open settings"
                icon={<HiCog6Tooth opacity={0.9} />}
                variant="ghost"
                onClick={onOpenSettings}
              />
            </>
          }
        </Flex>
      </header>


      {/* Settings Modal */}
      <Modal
        finalFocusRef={finalFocusRef}
        isOpen={isSettingsOpen}
        scrollBehavior="inside"
        size="xs"
        onClose={onCloseSettings}
      >
        <ModalOverlay />
        <ModalContent bg={foreground} boxShadow={0} userSelect="none">

          {isMobile && showVolumeSlider ?
            <Flex py="10px">
              <Flex
                alignItems="center"
                justifyContent="space-between"
                position="absolute"
                top={0}
                width="100%"
              >
                <IconButton
                  aria-label="Go back"
                  icon={<HiChevronLeft />}
                  px="10px"
                  variant="unstyled"
                  onClick={onPressHideVolumeSlider}
                />
                <IconButton
                  aria-label="Go back"
                  icon={<HiXMark />}
                  px="10px"
                  variant="unstyled"
                  onClick={onCloseSettings}
                />
              </Flex>

              <Flex
                alignItems="center"
                flex={1}
                flexDirection="column"
                gap="10px"
                height="300px"
                pb="10px"
                px="20px"
              >
                <Icon aria-label="Max volume" as={HiSpeakerWave} />
                <Slider
                  aria-label="Volume control"
                  colorScheme="purple"
                  height="100%"
                  isDisabled={!currentVideo}
                  max={100}
                  min={0}
                  orientation="vertical"
                  step={5}
                  value={localVolume}
                  variant="vertical"
                  onChange={val => onChangeVolumeHandler(val)}
                  onChangeEnd={val => onChangeEndVolumeHandler(val)}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
              </Flex>
            </Flex> :

            <>
              <ModalHeader fontSize="16px">
                <Flex
                  alignItems="center"
                  fontWeight="600"
                  justifyContent="space-between"
                  pl="20px"
                  width="100%"
                >
                  <Text textTransform="uppercase">Settings</Text>
                  <IconButton
                    aria-label="Close settings"
                    icon={<HiXMark />}
                    // mr="10px"
                    px="10px"
                    variant="unstyled"
                    onClick={onCloseSettings}
                  />
                </Flex>
              </ModalHeader>

              <VStack
                align="flex-start"
                fontSize="16px"
                gap="10px"
                pb="10px"
                px="20px"
              >

                <Text
                  fontSize="14"
                  mt="10px"
                  opacity={0.7}
                  textTransform="uppercase"
                >
                  Player
                </Text>

                {isMobile ?
                  <>
                    <HStack
                      as="button"
                      height="35px"
                      width="100%"
                      onClick={onPressShowVolumeSlider}
                    >
                      <HStack alignItems="center" width="100%">
                        <Icon aria-label="Adjust volume" as={HiSpeakerWave} />
                        <Text>Adjust volume</Text>
                      </HStack>
                      <Text>{`${localVolume}%`}</Text>
                    </HStack>
                    <Divider />
                  </> :
                  null
                }

                <HStack height="35px">
                  <Icon
                    aria-label={`${isConnected ? "Connected" : "Offline"}`}
                    as={HiChartBar}
                    color={isConnected ? "green" : "orange"}
                    mt="3px"
                  />
                  <Text>{`${isConnected ? "Connected" : "Offline"}`}</Text>
                </HStack>
                <Divider />

                <Text fontSize="14" opacity={0.7} textTransform="uppercase">Customise</Text>

                <ColorModeSwitcher />

                <Divider />

                <HStack
                  as="button"
                  height="35px"
                  width="100%"
                  onClick={toggleBgAnimated}
                >
                  <Icon aria-label={`${isBgAnimated ? "Disable" : "enable"} background animations `} as={isBgAnimated ? HiOutlineRocketLaunch : HiRocketLaunch} mt="3px" />
                  <Text>{`${isBgAnimated ? "Disable" : "Enable"} background animations `}</Text>
                </HStack>
                <Divider />

              </VStack>
              <ModalFooter
                alignItems="flex-start"
                flexDirection="column"
                opacity={0.7}
                pt="0px"
                px="20px"
              >
                <Flex
                  alignItems="center"
                  fontWeight="600"
                  justifyContent="space-between"
                  width="100%"
                >
                  <Text>R Jukebox</Text>
                  <Text>v 1.0</Text>
                </Flex>
                <Text fontSize="14" mt="5px">By Chris Sterkenburg</Text>
              </ModalFooter>
            </>
          }
        </ModalContent>
      </Modal>


      {/* Search and results */}
      <Modal
        finalFocusRef={finalFocusRef}
        isOpen={isSearchOpen}
        scrollBehavior="inside"
        size={isMobile ? "xs" : "md"}
        onClose={onCloseSearch}
      >
        <ModalOverlay />
        <ModalContent bg="transparent" boxShadow={0}>
          <Flex alignItems="center" flexDir="column">
            <InputGroup as="search">
              <InputLeftElement>
                <Icon aria-label="search icon" as={HiMagnifyingGlass} pointerEvents="none" />
              </InputLeftElement>
              <Input
                bg={foreground}
                borderRadius="6px"
                boxShadow="md"
                height="40px"
                id="search"
                placeholder="Search"
                px="10px"
                value={searchVal}
                variant="unstyled"
                width="100%"
                autoFocus
                onChange={val => setSearchVal(val.target.value)}
              />
              <InputRightElement>
                <IconButton
                  aria-label="Close search"
                  borderRadius="6px"
                  height="100%"
                  icon={<HiXMark />}
                  variant="link"
                  zIndex={10}
                  onClick={onClickXButton}
                />
              </InputRightElement>
            </InputGroup>
            {loading ?
              <Progress
                bgColor={foreground}
                borderBottomLeftRadius="6px"
                borderBottomRightRadius="6px"
                colorScheme="purple"
                height="8px"
                mt="-8px"
                width="100%"
                zIndex={1}
                isIndeterminate
              /> :
              null
            }
          </Flex>

          {videos.length > 0 || error ?
            <ModalBody bg={modalBg} mt="10px">
              <VStack>
                {error ? <Text mb="4px">{error}</Text> : <Text mb="4px">{`Showing the first ${NUM_OF_RESULTS} Youtube video results`}</Text>}
                {videos.map(video => {
                  if (!video) return;
                  return (
                    <VideoCard
                      key={video.videoId}
                      isMobile={isMobile}
                      playVideo={onClickCard}
                      video={video}
                    />
                  );
                })}
              </VStack>
            </ModalBody> :
            null
          }
        </ModalContent>
      </Modal>
    </>
  )
}
_PageHeader.displayName = "PageHeader";

/**
 * The page header contains a search bar and app settings menu.
 * 
 * @extends FlexProps Props to configure the container.
 * @returns {JSX.Element} The page header component.
 */
export const PageHeader = memo(_PageHeader);



type SearchBarBoxProps = BoxProps & {
  isMobile: boolean;
  onOpen: () => void
}

/**
 * Renders a input like styled box.
 * 
 * @param onOpen Callback for when the box is clicked. 
 * @returns {JSX.Element} The search bar box.
 */
const SearchBarBox: FC<SearchBarBoxProps> = ({ isMobile, onOpen, ...props }) => {
  const bg = useColorModeValue("white", "neutral.700");


  if (isMobile) return (
    <IconButton
      aria-label="Open search"
      colorScheme="purple"
      icon={<HiMagnifyingGlass />}
      variant="ghost"
      onClick={onOpen}
    />
  )
  return (
    <Box
      as="button"
      bg={bg}
      borderRadius={8}
      boxShadow="base"
      height="40px"
      px="10px"
      onClick={onOpen}
      {...props}
    >
      <HStack gap={4}>
        <Icon aria-label="Open search" as={HiMagnifyingGlass} />
        <Text opacity={0.7}>Search</Text>
        <Spacer />
        <HStack gap={1} userSelect="none">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </HStack>
      </HStack>
    </Box>
  );
}