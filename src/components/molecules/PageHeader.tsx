import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, BoxProps, Button, Divider, Flex, FlexProps, HStack, Icon, IconButton, Input, InputGroup, InputLeftElement, InputRightElement, Kbd, List, ListItem, ListProps, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, ModalProps, Progress, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Spacer, Text, Tooltip, useColorModeValue, useDisclosure, useMediaQuery, VStack } from "@chakra-ui/react";
import { FC, KeyboardEvent, memo, useCallback, useEffect, useRef, useState } from "react";
import { HiBugAnt, HiChartBar, HiChevronLeft, HiClipboardDocumentList, HiCog6Tooth, HiMagnifyingGlass, HiOutlineRocketLaunch, HiRocketLaunch, HiSpeakerWave, HiSpeakerXMark, HiStar, HiWrenchScrewdriver, HiXMark } from "react-icons/hi2";
import { ColorModeSwitcher } from "../atoms/ColorModeSwitcher";
import { VideoCard } from "components/atoms/VideoCard";
import { VideoControls } from "components/atoms/VideoControls";
import { useDebounce } from "@usesoftwareau/react-utils";
import { useYoutubeSearch } from "utils/hooks";
import { usePlayer } from "state/playerContext";
import { useAppState } from "state/appContext";
import { VERSION_NUM } from "../../constants";
import { v1_0ReleaseNotes } from "constants/releaseNotes/v1_0_x";
import { bugList } from "../../constants/bugList";
import { v1_1ReleaseNotes } from "constants/releaseNotes/v1_1_x";


const NUM_OF_RESULTS = 40;


const _PageHeader: FC<FlexProps> = (props) => {
  const { currentVideo, isPlaying, isPlayerLoading, resumeCurrentVideo, pauseCurrentVideo, playVideo, isConnected, playerVolume, updatePlayerVolume, updateCurrentVideoTime, addToBottomOfQueue, addToTopOfQueue, playNextQueueItem } = usePlayer();
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
              <Tooltip isDisabled={showingCurrentVideo} label="You can only change volume while a video is playing.">
                <VideoControls
                  disableButtons={!showingCurrentVideo}
                  flex={1}
                  isPlaying={isPlaying}
                  pauseCurrentVideo={pauseCurrentVideo}
                  playNextQueueItem={playNextQueueItem}
                  resumeCurrentVideo={resumeCurrentVideo}
                  updateCurrentVideoTime={updateCurrentVideoTime}
                />
              </Tooltip>
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
                disableButtons={!showingCurrentVideo}
                flex={1}
                isPlaying={isPlaying}
                pauseCurrentVideo={pauseCurrentVideo}
                playNextQueueItem={playNextQueueItem}
                resumeCurrentVideo={resumeCurrentVideo}
                updateCurrentVideoTime={updateCurrentVideoTime}
              />
              <SearchBarBox flex={1} isMobile={false} onOpen={onOpenSearch} />
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
                      colorScheme="purple"
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
      </header>

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
_PageHeader.displayName = "PageHeader";

/**
 * The page header contains a search bar and app settings menu.
 * 
 * @extends FlexProps Props to configure the container.
 * @returns {JSX.Element} The page header component.
 */
export const PageHeader = memo(_PageHeader);


type SettingsModalProps = Omit<ModalProps, "children"> & {
  finalFocusRef: React.MutableRefObject<null>;
  isBgAnimated: boolean;
  isConnected: boolean;
  isMobile: boolean;
  isVolumeDisabled: boolean;
  toggleBgAnimated: () => void;
  volumeLevel: number;
  onChangeEndVolumeHandler: (value: number) => void;
  onChangeVolumeHandler: (value: number) => void;
}


const SettingsModal: FC<SettingsModalProps> = ({ finalFocusRef, isBgAnimated, isConnected, isMobile, isOpen, volumeLevel, isVolumeDisabled, onChangeEndVolumeHandler, onChangeVolumeHandler, onClose, toggleBgAnimated }) => {
  const [screen, setScreen] = useState<"settings" | "volume" | "relNotes" | "bugList">("settings");

  const onCloseSettings = useCallback(() => {
    onClose();
    setScreen("settings");
  }, [onClose]);
  const onPressBackToSettings = useCallback(() => setScreen("settings"), []);
  const onPressShowReleaseNotes = useCallback(() => setScreen("relNotes"), []);
  const onPressShowVolumeSlider = useCallback(() => setScreen("volume"), []);
  const onPressShowBugList = useCallback(() => setScreen("bugList"), []);

  return (
    <Modal
      finalFocusRef={finalFocusRef}
      isOpen={isOpen}
      scrollBehavior="inside"
      size="xs"
      onClose={onCloseSettings}
    >
      <ModalOverlay />
      <ModalContent
        boxShadow={0}
        overflowY="auto"
        userSelect="none"
      >
        {isMobile && screen == "volume" ?
          <Flex py="10px">
            <Flex
              alignItems="center"
              justifyContent="space-between"
              pl="10px"
              position="absolute"
              top={0}
              width="100%"
            >
              <IconButton
                aria-label="Go back"
                icon={<HiChevronLeft />}
                px="10px"
                variant="unstyled"
                onClick={onPressBackToSettings}
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
              <Text>{`${volumeLevel}%`}</Text>
              <Slider
                aria-label="Volume control"
                colorScheme="purple"
                height="100%"
                isDisabled={isVolumeDisabled}
                max={100}
                min={0}
                orientation="vertical"
                step={5}
                value={volumeLevel}
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

          screen == "relNotes" ?
            <Flex flexDirection="column" height="483px">
              <Flex
                alignItems="center"
                fontWeight="600"
                justifyContent="space-between"
                pl="10px"
                width="100%"
              >
                <IconButton
                  aria-label="Go back"
                  icon={<HiChevronLeft />}
                  px="10px"
                  variant="unstyled"
                  onClick={onPressBackToSettings}
                />
                <IconButton
                  aria-label="Close settings"
                  icon={<HiXMark />}
                  px="10px"
                  variant="unstyled"
                  onClick={onCloseSettings}
                />
              </Flex>
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
                  V1.1
                </Text>
                <ReleaseNotesAccordion releaseNotes={v1_1ReleaseNotes} />

                <Text
                  fontSize="14"
                  mt="10px"
                  opacity={0.7}
                  textTransform="uppercase"
                >
                  V1.0
                </Text>
                <ReleaseNotesAccordion releaseNotes={v1_0ReleaseNotes} />
              </VStack>
            </Flex> :

            screen == "bugList" ?
              <Flex flexDirection="column" maxHeight="483px">
                <Flex
                  alignItems="center"
                  fontWeight="600"
                  justifyContent="space-between"
                  pl="10px"
                  width="100%"
                >
                  <IconButton
                    aria-label="Go back"
                    icon={<HiChevronLeft />}
                    px="10px"
                    variant="unstyled"
                    onClick={onPressBackToSettings}
                  />
                  <IconButton
                    aria-label="Close settings"
                    icon={<HiXMark />}
                    px="10px"
                    variant="unstyled"
                    onClick={onCloseSettings}
                  />
                </Flex>
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
                    Known Bugs
                  </Text>

                  <Accordion width="100%" allowToggle>
                    {bugList.map(note => (
                      <AccordionItem key={note.title}>
                        <h2>
                          <Flex
                            _hover={{ bgColor: "transparent" }}
                            alignItems="flex-start"
                            as={AccordionButton}
                            gap="10px"
                            px={0}
                          >
                            <Box mt="3px">
                              <Icon aria-roledescription="Bullet point" as={HiBugAnt} color="red.300" />
                            </Box>
                            <Box as="span" flex={1} textAlign="left">
                              {note.title}
                            </Box>
                            <AccordionIcon />
                          </Flex>
                        </h2>
                        <AccordionPanel pb={4} px={0}>
                          {note.details}
                        </AccordionPanel>
                      </AccordionItem>
                    ))}
                  </Accordion>

                  <Box>
                    <Text fontSize="14" opacity={0.7}>Let me know if you encounter any new bugs not already listed here 😊</Text>
                    <Text fontSize="14" opacity={0.7}>- Sterk</Text>
                  </Box>
                </VStack>
              </Flex> :
              <>
                <ModalHeader>
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
                    {isMobile ? "Player" : "Player status"}
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
                        <Text>{`${volumeLevel}%`}</Text>
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
                    <Text opacity={0.7}>{`${isConnected ? "Connected" : "Offline"}`}</Text>
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

                  <Text fontSize="14" opacity={0.7} textTransform="uppercase">About</Text>

                  <HStack
                    as="button"
                    height="35px"
                    width="100%"
                    onClick={onPressShowReleaseNotes}
                  >
                    <Icon aria-label="Release notes" as={HiClipboardDocumentList} mt="3px" />
                    <Text>Release notes</Text>
                  </HStack>

                  <Divider />

                  <HStack
                    as="button"
                    height="35px"
                    width="100%"
                    onClick={onPressShowBugList}
                  >
                    <Icon aria-label="Bug list" as={HiBugAnt} mt="3px" />
                    <Text>Known bugs</Text>
                  </HStack>
                  <Divider />

                </VStack>
                <ModalFooter
                  alignItems="flex-start"
                  opacity={0.7}
                  pt="0px"
                >
                  <Flex
                    alignItems="center"
                    fontWeight="600"
                    justifyContent="space-between"
                    width="100%"
                  >
                    <Text>R Jukebox</Text>
                    <Text>{`v ${VERSION_NUM}`}</Text>
                  </Flex>
                  <Flex
                    alignItems="center"
                    fontSize="14"
                    justifyContent="space-between"
                    width="100%"
                  >
                    <Text>By Chris Sterkenburg</Text>
                    <Text>2024</Text>
                  </Flex>
                </ModalFooter>
              </>
        }
      </ModalContent>
    </Modal>
  );
};


type NewUpdateModalProps = Omit<ModalProps, "children"> & { isMobile: boolean }
const NewUpdateModal: FC<NewUpdateModalProps> = ({ onClose, isOpen, isMobile }) => {
  const foreground = useColorModeValue("white", "neutral.700");

  return (
    <Modal
      closeOnEsc={false}
      closeOnOverlayClick={false}
      isOpen={isOpen}
      scrollBehavior="inside"
      size={isMobile ? "sm" : "md"}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent
        bg={foreground}
        boxShadow={0}
        overflowY="auto"
        userSelect="none"
      >
        <Flex flexDirection="column" p="10px 20px 20px">
          <Text as="h1" fontSize="32" fontWeight={600}>{`${v1_1ReleaseNotes[0].title} is here!`}</Text>
          <Text
            as="h2"
            fontSize="24"
            fontWeight={500}
            opacity={0.7}
          >
            What's new?
          </Text>
          <Notes date={v1_1ReleaseNotes[0].date} mt="10px" notes={v1_1ReleaseNotes[0].notes} />

          <Button
            colorScheme="purple"
            mt="30px"
            pb="2px"
            onClick={onClose}
          >
            Lets go!
          </Button>
        </Flex>
      </ModalContent>
    </Modal>
  );
};


type SearchModalProps = Omit<ModalProps, "children"> & {
  finalFocusRef: React.MutableRefObject<null>;
  isMobile: boolean;
  handlePlayVideo: (video: Video) => void;
  handleAddToBottomOfQueue: (video: Video) => void;
  handleAddToTopOfQueue: (video: Video) => void;
}

const SearchModal: FC<SearchModalProps> = ({ finalFocusRef, isMobile, isOpen, handlePlayVideo, handleAddToBottomOfQueue, handleAddToTopOfQueue, onClose }) => {
  const foreground = useColorModeValue("white", "neutral.700");

  const [searchVal, setSearchVal] = useState<string>("");
  const query = useDebounce(searchVal, 1000);
  const { error, loading, videos } = useYoutubeSearch(query, NUM_OF_RESULTS);


  /** Clears the input if there is a value otherwise closes the modal. */
  const onClickXButton = useCallback(() => {
    if (!searchVal) return onClose();
    setSearchVal("");
  }, [onClose, searchVal]);


  return (
    <Modal
      finalFocusRef={finalFocusRef}
      isOpen={isOpen}
      scrollBehavior="inside"
      size={isMobile ? "xs" : "md"}
      onClose={onClickXButton}
    >
      <ModalOverlay />
      <ModalContent bg="transparent" boxShadow={0}>
        <Flex alignItems="center" flexDir="column">
          <InputGroup as="search">
            <InputLeftElement pointerEvents="none">
              <Icon aria-label="search icon" as={HiMagnifyingGlass} />
            </InputLeftElement>
            <Input
              bg={foreground}
              borderRadius="6px"
              boxShadow="md"
              height="40px"
              id="search"
              placeholder="Search Youtube"
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
          <ModalBody
            borderRadius={5}
            mt="10px"
            px="10px"
          >
            <VStack>
              {error ? <Text mb="4px">{error}</Text> : <Text mb="4px">{`Showing the first ${NUM_OF_RESULTS} Youtube video results`}</Text>}
              {videos.map(video => {
                if (!video) return;
                return (
                  <VideoCard
                    key={video.videoId}
                    addToBottomOfQueue={handleAddToBottomOfQueue}
                    addToTopOfQueue={handleAddToTopOfQueue}
                    isMobile={isMobile}
                    playVideo={handlePlayVideo}
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
  );
};



type SearchBarBoxProps = BoxProps & {
  isMobile: boolean;
  onOpen: () => void
}

/**
 * Renders a input like styled box.
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


type ReleaseNotesAccordionProps = { releaseNotes: ReleaseNotes }
const ReleaseNotesAccordion: FC<ReleaseNotesAccordionProps> = ({ releaseNotes }) => {
  return (
    <Accordion width="100%" allowToggle>
      {releaseNotes.map(release => (
        <AccordionItem key={release.title}>
          <h2>
            <HStack
              _hover={{ bgColor: "transparent" }}
              as={AccordionButton}
              px={0}
            >
              <Box as="span" flex={1} textAlign="left">
                {release.title}
              </Box>
              <AccordionIcon />
            </HStack>
          </h2>
          <AccordionPanel pb={4} px={0}>
            <Notes date={release.date} notes={release.notes} />
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  )
}


type NotesProps = ListProps & { notes: ReleaseNote[]; date?: string }
const Notes: FC<NotesProps> = ({ notes, date, ...props }) => {
  return (
    <List spacing="10px" {...props}>
      <Text fontSize="14" mt="-10px" opacity={0.7}>{date}</Text>
      {notes.map(note => (
        <ListItem key={note.details}>
          <Flex gap="10px">
            <Box mt="2px">
              <Icon
                aria-roledescription="Bullet point"
                as={note.kind == "bugFix" ? HiBugAnt : note.kind == "improvement" ? HiWrenchScrewdriver : HiStar}
                color={note.kind == "bugFix" ? "red.300" : note.kind == "improvement" ? "purple.300" : "yellow.500"}
              />
            </Box>
            <Flex flex={1}>{note.details}</Flex>
          </Flex>
        </ListItem>
      ))}
    </List>
  );
}