import { IconButton, IconButtonProps, useColorMode, useColorModeValue } from "@chakra-ui/react"
import { HiMoon, HiSun } from "react-icons/hi2"

type ColorModeSwitcherProps = Omit<IconButtonProps, "aria-label">

export const ColorModeSwitcher: React.FC<ColorModeSwitcherProps> = (props) => {
  const { toggleColorMode } = useColorMode()
  const text = useColorModeValue("dark", "light")
  const SwitchIcon = useColorModeValue(HiMoon, HiSun);

  return (
    <IconButton
      aria-label={`Switch to ${text} mode`}
      colorScheme="purple"
      icon={<SwitchIcon />}
      variant="ghost"
      onClick={toggleColorMode}
      {...props}
    />
  )
}
