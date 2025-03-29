import { Button, Flex, HStack, IconButton, Modal, ModalContent, ModalHeader, ModalOverlay, ModalProps, Text } from "@chakra-ui/react";
import { FC, useCallback, useState } from "react";
import { HiChevronLeft, HiXMark } from "react-icons/hi2";
import { VolumeScreen } from "./VolumeScreen";
import { ReleaseNotesScreen } from "./ReleaseNotesScreen";
import { LogsScreen } from "./LogsScreen";
import { LandingScreen } from "./LandingScreen";


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
  entryLogs: EntryLog[];
}

export type SettingScreens = "settings" | "volume" | "relNotes" | "logs";

export const SettingsModal: FC<SettingsModalProps> = ({ finalFocusRef, isBgAnimated, isConnected, isMobile, isOpen, volumeLevel, isVolumeDisabled, entryLogs, onChangeEndVolumeHandler, onChangeVolumeHandler, onClose, toggleBgAnimated }) => {
  const [screen, setScreen] = useState<SettingScreens>("settings");

  const onCloseSettings = useCallback(() => {
    onClose();
    setScreen("settings");
  }, [onClose]);


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
        <ModalHeader>
          <Flex
            alignItems="center"
            fontWeight="600"
            justifyContent="space-between"
            width="100%"
          >
            <HStack gap={1}>
              {screen !== "settings" ?
                <Button
                  alignItems="center"
                  aria-label="Go back"
                  display="flex"
                  justifyContent="center"
                  leftIcon={<HiChevronLeft style={{ paddingTop: 2 }} />}
                  pl="10px"
                  textTransform="uppercase"
                  variant="unstyled"
                  onClick={() => setScreen("settings")}
                >
                  Settings
                </Button> :
                <Text pl="20px" textTransform="uppercase">Settings</Text>
              }
            </HStack>
            <IconButton
              alignItems="center"
              aria-label="Close settings"
              display="flex"
              icon={<HiXMark />}
              justifyContent="center"
              size="md"              
              variant="unstyled"
              onClick={onCloseSettings}
            />
          </Flex>
        </ModalHeader>

        {isMobile && screen == "volume" ?
          <VolumeScreen
            isVolumeDisabled={isVolumeDisabled}
            volumeLevel={volumeLevel}
            onChangeEndVolumeHandler={onChangeEndVolumeHandler}
            onChangeVolumeHandler={onChangeVolumeHandler}
          /> :
          screen == "relNotes" ?
            <ReleaseNotesScreen /> :
            screen == "logs" ?
              <LogsScreen entryLogs={entryLogs} /> :
              <LandingScreen
                isBgAnimated={isBgAnimated}
                isConnected={isConnected}
                isMobile={isMobile}
                setScreen={setScreen}
                toggleBgAnimated={toggleBgAnimated}
                volumeLevel={volumeLevel}
              />
        }
      </ModalContent>
    </Modal>
  );
};