import { Flex, Heading, Text, VStack } from "@chakra-ui/react"
import { FC } from "react"
import { ReleaseNotesAccordion } from "../ReleaseNotes"
import { v1_3ReleaseNotes } from "constants/releaseNotes/v1_3_x"
import { v1_2ReleaseNotes } from "constants/releaseNotes/v1_2_x"
import { v1_1ReleaseNotes } from "constants/releaseNotes/v1_1_x"
import { v1_0ReleaseNotes } from "constants/releaseNotes/v1_0_x"

type ReleaseNotesProps = {}

export const ReleaseNotesScreen: FC<ReleaseNotesProps> = () => {
  return (
    <Flex flexDirection="column" height="483px">
      <Heading fontSize={18} px="20px" py="10px">Release Notes</Heading>
      <VStack
        align="flex-start"
        fontSize="16px"
        gap="10px"
        overflowY="auto"
        pb="10px"
        px="20px"
      >
        <Text
          fontSize="14"
          mt="10px"
          opacity={0.7}
          textTransform="uppercase"
        >
          V1.3 - Auto complete
        </Text>
        <ReleaseNotesAccordion releaseNotes={v1_3ReleaseNotes} />

        <Text
          fontSize="14"
          mt="10px"
          opacity={0.7}
          textTransform="uppercase"
        >
          V1.2 - Queue
        </Text>
        <ReleaseNotesAccordion releaseNotes={v1_2ReleaseNotes} />

        <Text
          fontSize="14"
          mt="10px"
          opacity={0.7}
          textTransform="uppercase"
        >
          V1.1 - History
        </Text>
        <ReleaseNotesAccordion releaseNotes={v1_1ReleaseNotes} />

        <Text
          fontSize="14"
          mt="10px"
          opacity={0.7}
          textTransform="uppercase"
        >
          V1.0 - Launch
        </Text>
        <ReleaseNotesAccordion releaseNotes={v1_0ReleaseNotes} />
      </VStack>
    </Flex>
  )
}
ReleaseNotesScreen.displayName = "ReleaseNotesScreen";