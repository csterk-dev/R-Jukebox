import { HStack, Icon, IconButton, StackProps, Text, Tooltip, useColorMode, useColorModeValue } from "@chakra-ui/react"
import { FC, memo } from "react"
import { HiMoon, HiSun } from "react-icons/hi2"

type ColorModeSwitcherProps = StackProps & {
  /**Disables the tooltip when `isIconButtonOnly` is true. */
  disableTooltip?: boolean;
  /** Renders a pressabe icon and text instead. */
  isIconButtonOnly?: boolean;
}


const _ColorModeSwitcher: FC<ColorModeSwitcherProps> = ({ disableTooltip, isIconButtonOnly, ...props }) => {
  const { toggleColorMode } = useColorMode()
  const text = useColorModeValue("dark", "light")
  const SwitchIcon = useColorModeValue(HiMoon, HiSun);


  if (isIconButtonOnly) {
    return (
      <Tooltip isDisabled={disableTooltip} label={`Switch to ${text} mode`}>
        <IconButton
          aria-label={`Switch to ${text} mode`}
          icon={<SwitchIcon />}
          size="md"
          variant="ghost"
          onClick={toggleColorMode}
        />
      </Tooltip>
    );
  }

  return (
    <HStack
      as="button"
      gap="10px"
      height="35px"
      width="100%"
      onClick={toggleColorMode}
      {...props}
    >
      <Icon as={SwitchIcon} mt="3px" />
      <Text>{`Switch to ${text} mode`}</Text>
    </HStack>

  );
}
_ColorModeSwitcher.displayName = "ColorModeSwitcher";


/**
 * Renders a button to toggle colormodes.
 * @returns {JSX.Element} The toggle button.
 */
export const ColorModeSwitcher = memo(_ColorModeSwitcher);