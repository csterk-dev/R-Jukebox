import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Divider, Flex, HStack, Icon, IconButton, Modal, ModalContent, ModalFooter, ModalHeader, ModalOverlay, ModalProps, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Text, VStack } from "@chakra-ui/react";
import { FC, useCallback, useState } from "react";
import { HiBugAnt, HiChartBar, HiChevronLeft, HiClipboardDocumentList, HiOutlineRocketLaunch, HiRocketLaunch, HiSpeakerWave, HiXMark } from "react-icons/hi2";
import { v1_0ReleaseNotes } from "constants/releaseNotes/v1_0_x";
import { v1_1ReleaseNotes } from "constants/releaseNotes/v1_1_x";
import { v1_2ReleaseNotes } from "constants/releaseNotes/v1_2_x";
import { ReleaseNotesAccordion } from "./ReleaseNotes";
import { BUG_LIST } from "constants/bugList";
import { ColorModeSwitcher } from "components/atoms/ColorModeSwitcher";
import { VERSION_NUM } from "constants/index";
import { v1_3ReleaseNotes } from "constants/releaseNotes/v1_3_x";


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


export const SettingsModal: FC<SettingsModalProps> = ({ finalFocusRef, isBgAnimated, isConnected, isMobile, isOpen, volumeLevel, isVolumeDisabled, onChangeEndVolumeHandler, onChangeVolumeHandler, onClose, toggleBgAnimated }) => {
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
                colorScheme="brand"
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
                overflowY="auto"
                pb="10px"
                px="20px"
              >
                <Text
                  fontSize="14"
                  mt="10px"
                  opacity={0.7}
                  textTransform="uppercase"
                >
                  V1.3 - Auto complete
                </Text>
                <ReleaseNotesAccordion releaseNotes={v1_3ReleaseNotes} />

                <Text
                  fontSize="14"
                  mt="10px"
                  opacity={0.7}
                  textTransform="uppercase"
                >
                  V1.2 - Queue
                </Text>
                <ReleaseNotesAccordion releaseNotes={v1_2ReleaseNotes} />

                <Text
                  fontSize="14"
                  mt="10px"
                  opacity={0.7}
                  textTransform="uppercase"
                >
                  V1.1 - History
                </Text>
                <ReleaseNotesAccordion releaseNotes={v1_1ReleaseNotes} />

                <Text
                  fontSize="14"
                  mt="10px"
                  opacity={0.7}
                  textTransform="uppercase"
                >
                  V1.0 - Launch
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
                  overflowY="auto"
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
                    {BUG_LIST.map(note => (
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
                    <Text>2025</Text>
                  </Flex>
                </ModalFooter>
              </>
        }
      </ModalContent>
    </Modal>
  );
};