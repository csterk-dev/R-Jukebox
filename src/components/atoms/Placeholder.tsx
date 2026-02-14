import { Box, Flex, FlexProps, Icon, Text } from "@chakra-ui/react";
import { FC } from "react";
import { IconType } from "react-icons";


type PlaceholderProps = FlexProps & {
  title: string;
  icon: IconType;
  iconBgOverride?: string;
  iconBgDarkOverride?: string;
}

/** A placeholder element that renders an icon and heading info text */
export const Placeholder: FC<PlaceholderProps> = ({ title, icon, iconBgOverride: iconBg, iconBgDarkOverride: iconBgDark, ...props }) => {
  return (
    <Flex
      alignItems="center"
      flexDir="column"
      gap={5}
      justifyContent="center"
      {...props}
    >
      <Box
        _dark={{ bg: iconBgDark ?? "neutral.400" }}
        bg={iconBg ?? "white"}
        borderRadius="full"
        p={5}
      >
        <Icon
          as={icon}
          fontSize="70px"
        />
      </Box>
      <Text color="fg.body" textAlign="center">{title}</Text>
    </Flex>
  )
}
Placeholder.displayName = "Placeholder";