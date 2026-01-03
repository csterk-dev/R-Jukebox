import { Button, Dialog, HStack, Icon, Separator, Text } from "@chakra-ui/react";
import { useTheme } from "next-themes";
import { Dispatch, FC, ReactNode, SetStateAction, useCallback, useMemo } from "react";
import { HiChartBar, HiClipboardDocumentList, HiCodeBracket, HiMoon, HiOutlineRocketLaunch, HiRocketLaunch, HiSpeakerWave, HiSun } from "react-icons/hi2";
import { SettingScreens } from ".";

type LandScreenProps = {
  isBgAnimated: boolean;
  isConnected: boolean;
  isMobile: boolean;
  toggleBgAnimated: () => void;
  volumeLevel: number;
  setScreen: Dispatch<SetStateAction<SettingScreens>>;
}

type SettingsMenuItemProps = {
  icon: ReactNode;
  label: string;
  ariaLabel: string;
  onClick: () => void;
  rightContent?: ReactNode;
  iconProps?: Record<string, unknown>;
}

const SettingsMenuItem: FC<SettingsMenuItemProps> = ({ 
  icon, 
  label, 
  ariaLabel, 
  onClick, 
  rightContent,
  iconProps = { mt: "3px" }
}) => {
  return (
    <Button
      _hover={{ cursor: "pointer" }}
      as="button"
      height="35px"
      justifyContent="flex-start"
      px={0}
      width="100%"
      onClick={onClick}
    >
      {rightContent ? (
        <HStack alignItems="center" width="100%">
          <Icon aria-label={ariaLabel} {...iconProps}>
            {icon}
          </Icon>
          <Text>{label}</Text>
        </HStack>
      ) : (
        <>
          <Icon aria-label={ariaLabel} {...iconProps}>
            {icon}
          </Icon>
          <Text>{label}</Text>
        </>
      )}
      {rightContent}
    </Button>
  );
};
SettingsMenuItem.displayName = "SettingsMenuItem";


export const LandingScreen: FC<LandScreenProps> = ({ isBgAnimated, isConnected, isMobile, toggleBgAnimated, volumeLevel, setScreen }) => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const toggleColorMode = useCallback(() => setTheme(isDark ? "light" : "dark"), [isDark, setTheme]);
  const colorModeText = useMemo(() => isDark ? "light" : "dark", [isDark]);
  const handleRelNotesClick = useCallback(() => setScreen("relNotes"), [setScreen]);
  const handleLogsClick = useCallback(() => setScreen("logs"), [setScreen]);

  return (
    <Dialog.Body>
      <Text textStyle="heading/sub-section">
        {isMobile ? "Player" : "Player status"}
      </Text>

      {isMobile ?
        <>
          <SettingsMenuItem
            ariaLabel="Adjust volume"
            icon={<HiSpeakerWave />}
            iconProps={{}}
            label="Adjust volume"
            rightContent={<Text>{`${volumeLevel}%`}</Text>}
            onClick={() => setScreen("volume")}
          />
          <Separator />
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
      <Separator />

      <Text textStyle="heading/sub-section">Customise</Text>

      <SettingsMenuItem
        ariaLabel={`Switch to ${colorModeText} mode`}
        icon={isDark ? <HiSun /> : <HiMoon />}
        label={`Switch to ${colorModeText} mode`}
        onClick={toggleColorMode}
      />

      <Separator />

      <SettingsMenuItem
        ariaLabel={`${isBgAnimated ? "Disable" : "enable"} background animations `}
        icon={isBgAnimated ? <HiOutlineRocketLaunch /> : <HiRocketLaunch />}
        label={`${isBgAnimated ? "Disable" : "Enable"} background animations `}
        onClick={toggleBgAnimated}
      />

      <Separator />

      <Text textStyle="heading/sub-section">About</Text>

      <SettingsMenuItem
        ariaLabel="Release notes"
        icon={<HiClipboardDocumentList />}
        label="Release notes"
        onClick={handleRelNotesClick}
      />

      <Separator />

      <SettingsMenuItem
        ariaLabel="Bug list"
        icon={<HiCodeBracket />}
        label="Player logs"
        onClick={handleLogsClick}
      />
      <Separator />
    </Dialog.Body>
  )
}
LandingScreen.displayName = "LandingScreen";