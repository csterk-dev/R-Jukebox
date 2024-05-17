import { HStack, Icon, IconButton, IconButtonProps, Text, Tooltip, useColorMode, useColorModeValue } from "@chakra-ui/react"
import { FC } from "react"
import { HiMoon, HiSun } from "react-icons/hi2"

type ColorModeSwitcherProps = Omit<IconButtonProps, "aria-label"> & {
  disableTooltip?: boolean;
  withText?: boolean;
}

/**
 * Allows the user to toggle the current color mode.
 * 
 * @returns An Icon button toggle switch.
 */
export const ColorModeSwitcher: FC<ColorModeSwitcherProps> = ({ disableTooltip, withText, ...props }) => {
  const { toggleColorMode } = useColorMode()
  const text = useColorModeValue("dark", "light")
  const SwitchIcon = useColorModeValue(HiMoon, HiSun);

  if (withText) return (
    <HStack 
      as="button"
      gap="10px"
      width="100%"
      onClick={toggleColorMode}
    >
      <Icon as={SwitchIcon} />
      <Text>{`Switch to ${text} mode`}</Text>
    </HStack>
  );

  return (
    <Tooltip isDisabled={disableTooltip} label={`Switch to ${text} mode`}>
      <IconButton
        aria-label={`Switch to ${text} mode`}
        colorScheme="purple"
        icon={<SwitchIcon />}
        variant="ghost"
        onClick={toggleColorMode}
        {...props}
      />
    </Tooltip>
  );
}
