import { Dialog, DialogOpenChangeDetails, Flex, HStack, Icon, IconButton, Text } from "@chakra-ui/react";
import { FC, useCallback, useState } from "react";
import { HiChevronLeft, HiXMark } from "react-icons/hi2";
import { VolumeScreen } from "./VolumeScreen";
import { ReleaseNotesScreen } from "./ReleaseNotesScreen";
import { LogsScreen } from "./LogsScreen";
import { LandingScreen } from "./LandingScreen";
import { VERSION_NUM } from "@constants";


const BODY_HEIGHT = "427px";


type SettingsModalProps = {
  isBgAnimated: boolean;
  isConnected: boolean;
  isMobile: boolean;
  isOpen: boolean;
  isVolumeDisabled: boolean;
  onClose: () => void;
  toggleBgAnimated: () => void;
  volumeLevel: number;
  onChangeEndVolumeHandler: (value: number) => void;
  onChangeVolumeHandler: (value: number) => void;
  entryLogs: EntryLog[];
}

export type SettingScreens = "settings" | "volume" | "relNotes" | "logs";

export const SettingsModal: FC<SettingsModalProps> = ({ isBgAnimated, isConnected, isMobile, isOpen, volumeLevel, isVolumeDisabled, entryLogs, onChangeEndVolumeHandler, onChangeVolumeHandler, onClose, toggleBgAnimated }) => {
  const [screen, setScreen] = useState<SettingScreens>("settings");

  const onCloseSettings = useCallback(() => {
    onClose();
    setScreen("settings");
  }, [onClose]);


  return (
    <Dialog.Root
      open={isOpen}
      scrollBehavior="inside"
      size="xs"
      variant="settings"
      onOpenChange={useCallback((e: DialogOpenChangeDetails) => !e.open && onCloseSettings(), [onCloseSettings])}
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content
          boxShadow="none"
          layerStyle="themed-scroll"
          overflowY="auto"
          userSelect="none"
        >
          <Dialog.Header
            alignItems="center"
            display="flex"
            fontWeight="semibold"
            justifyContent="space-between"
            width="100%"
          >
            <HStack gap={1}>
              {screen !== "settings" ?
                <Flex
                  _hover={{ cursor: "pointer" }}
                  alignItems="center"
                  aria-label="Go back"
                  justifyContent="center"
                  role="button"
                  onClick={() => setScreen("settings")}
                >
                  <Icon mr={2} mt="2px">
                    <HiChevronLeft />
                  </Icon>
                  <Dialog.Title>Settings</Dialog.Title>
                </Flex> :
                <Dialog.Title>Settings</Dialog.Title>
              }
            </HStack>

            <Dialog.CloseTrigger asChild>
              <IconButton
                alignItems="center"
                aria-label="Close settings"
                display="flex"
                justifyContent="center"
                size="md"
                variant="plain"
              >
                <HiXMark />
              </IconButton>
            </Dialog.CloseTrigger>
          </Dialog.Header>

          {isMobile && screen == "volume" ?
            <VolumeScreen
              isVolumeDisabled={isVolumeDisabled}
              maxH={BODY_HEIGHT} 
              minH={BODY_HEIGHT}
              volumeLevel={volumeLevel}
              onChangeEndVolumeHandler={onChangeEndVolumeHandler}
              onChangeVolumeHandler={onChangeVolumeHandler}
            /> :
            screen == "relNotes" ?
              <ReleaseNotesScreen maxH={BODY_HEIGHT} minH={BODY_HEIGHT} /> :
              screen == "logs" ?
                <LogsScreen entryLogs={entryLogs} maxH={BODY_HEIGHT} minH={BODY_HEIGHT} /> :
                <LandingScreen
                  isBgAnimated={isBgAnimated}
                  isConnected={isConnected}
                  isMobile={isMobile}
                  setScreen={setScreen}
                  toggleBgAnimated={toggleBgAnimated}
                  volumeLevel={volumeLevel}
                />
          }

          {screen == "settings" ?
            <Dialog.Footer>
              <Flex
                alignItems="center"
                fontWeight="semibold"
                justifyContent="space-between"
                textStyle="body/sub-text"
                width="100%"
              >
                <Text>R Jukebox</Text>
                <Text>{`v ${VERSION_NUM}`}</Text>
              </Flex>
              <Flex
                alignItems="center"
                justifyContent="space-between"
                textStyle="body/label"
                width="100%"
              >
                <Text>By Chris Sterkenburg</Text>
                <Text>2025</Text>
              </Flex>
            </Dialog.Footer> :
            null
          }
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};