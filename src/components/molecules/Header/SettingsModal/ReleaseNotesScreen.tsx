import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import { FC } from "react";
import { Notes } from "components/atoms/Notes";
import { v1_3ReleaseNotes } from "constants/releaseNotes/v1_3_x";
import { v1_2ReleaseNotes } from "constants/releaseNotes/v1_2_x";
import { v1_1ReleaseNotes } from "constants/releaseNotes/v1_1_x";
import { v1_0ReleaseNotes } from "constants/releaseNotes/v1_0_x";


const RELEASE_NOTES = [
  {
    title: "V1.3 - Auto Complete",
    notes: v1_3ReleaseNotes
  },
  {
    title: "V1.2 - Queue",
    notes: v1_2ReleaseNotes
  },
  {
    title: "V1.1 - History",
    notes: v1_1ReleaseNotes
  },
  {
    title: "V1.0 - Launch",
    notes: v1_0ReleaseNotes
  }
];


export const ReleaseNotesScreen: FC = () => {
  return (
    <Flex flexDirection="column" h="448px">
      <Text
        as="h1" 
        fontSize={18}
        fontWeight="semibold"
        px="20px"
        py="10px"
      >
        Release Notes
      </Text>

      <VStack
        align="flex-start"
        fontSize="16px"
        gap="10px"
        overflowY="auto"
        pb="10px"
        px="20px"
      >
        <Accordion width="100%" allowToggle>
          {RELEASE_NOTES.map(({ title, notes }) => (
            <Box key={title} pb="10px" width="100%">
              <Text
                as="h2"
                fontSize="14px"
                mt="10px"
                opacity={0.7}
                textTransform="uppercase"
              >
                {title}
              </Text>
              {notes.map((release) => (
                <AccordionItem key={release.versionNum}>
                  <h3>
                    <HStack
                      _hover={{ bgColor: "transparent" }}
                      as={AccordionButton}
                      px={0}
                    >
                      <Box as="span" flex={1} textAlign="left">
                        {release.versionNum}
                      </Box>
                      <AccordionIcon />
                    </HStack>
                  </h3>
                  <AccordionPanel pb={4} px={0}>
                    <Notes date={release.date} notes={release.notes} />
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Box>
          ))}
        </Accordion>
      </VStack>
    </Flex>
  );
};

ReleaseNotesScreen.displayName = "ReleaseNotesScreen";
