import { Badge, Divider, Flex, HStack, Icon, ModalFooter, Text, VStack } from "@chakra-ui/react";
import { ColorModeSwitcher } from "components/atoms/ColorModeSwitcher";
import { VERSION_NUM } from "constants/index";
import { Dispatch, FC, SetStateAction } from "react";
import { HiChartBar, HiClipboardDocumentList, HiCodeBracket, HiOutlineRocketLaunch, HiRocketLaunch, HiSpeakerWave } from "react-icons/hi2";
import { SettingScreens } from ".";

type LandScreenProps = {
  isBgAnimated: boolean;
  isConnected: boolean;
  isMobile: boolean;
  toggleBgAnimated: () => void;
  volumeLevel: number;
  setScreen: Dispatch<SetStateAction<SettingScreens>>;
}


export const LandingScreen: FC<LandScreenProps> = ({ isBgAnimated, isConnected, isMobile, toggleBgAnimated, volumeLevel, setScreen }) => {
  return (
    <>
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
              onClick={() => setScreen("volume")}
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
          onClick={() => setScreen("relNotes")}
        >
          <Icon aria-label="Release notes" as={HiClipboardDocumentList} mt="3px" />
          <Text>Release notes</Text>
        </HStack>

        <Divider />

        <HStack
          as="button"
          height="35px"
          width="100%"
          onClick={() => setScreen("logs")}
        >
          <Icon aria-label="Bug list" as={HiCodeBracket} mt="3px" />
          <Text>Player logs</Text>
          <Badge colorScheme="green" ml="auto">New</Badge>
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
  )
}
LandingScreen.displayName = "LandingScreen";