import { HStack, Icon, StackProps, Text, useColorMode, useColorModeValue } from "@chakra-ui/react"
import { FC, memo } from "react"
import { HiMoon, HiSun } from "react-icons/hi2"

type ColorModeSwitcherProps = StackProps & {}


const _ColorModeSwitcher: FC<ColorModeSwitcherProps> = ({ ...props }) => {
  const { toggleColorMode } = useColorMode()
  const text = useColorModeValue("dark", "light")
  const SwitchIcon = useColorModeValue(HiMoon, HiSun);

  return (
    <HStack
      as="button"
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