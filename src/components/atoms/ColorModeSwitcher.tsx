import { HStack, Icon, StackProps, Text } from "@chakra-ui/react"
import { useTheme } from "next-themes"
import { FC, memo, useCallback, useMemo } from "react"
import { HiMoon, HiSun } from "react-icons/hi2"

type ColorModeSwitcherProps = StackProps & {}


const _ColorModeSwitcher: FC<ColorModeSwitcherProps> = ({ ...props }) => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const toggleColorMode = useCallback(() => setTheme(isDark ? "light" : "dark"), [isDark, setTheme]);
  const text = isDark ? "light" : "dark";
  const SwitchIcon = useMemo(() => isDark ? HiSun : HiMoon, [isDark]);

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
 * @deprecated This component is deprecated. Use SettingsMenuItem in the landing screen instead.
 * Renders a button to toggle colormodes.
 * @returns {JSX.Element} The toggle button.
 */
export const ColorModeSwitcher = memo(_ColorModeSwitcher);