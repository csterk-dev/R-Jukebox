import { Box, Flex, FlexProps, Heading, Icon } from "@chakra-ui/react";
import { FC } from "react";
import { IconType } from "react-icons";


type PlaceholderProps = FlexProps & {
  title: string;
  icon: IconType;
  iconBg?: string;
  iconBgDark?: string;
}

/** A placeholder element that renders an icon and heading info text */
export const Placeholder: FC<PlaceholderProps> = ({ title, icon, iconBg, iconBgDark, ...props }) => {
  return (
    <Flex
      alignItems="center"
      flexDir="column"
      gap="10px"
      justifyContent="center"
      {...props}
    >
      <Box
        _dark={{ bg: iconBgDark ?? "neutral.400" }}
        bg={iconBg ?? "white"}
        borderRadius="90"
        p="20px"
      >
        <Icon
          as={icon}
          fontSize="70px"
        />
      </Box>
      <Heading fontSize="18px" opacity={0.7} textAlign="center">{title}</Heading>
    </Flex>
  )
}
Placeholder.displayName = "Placeholder";