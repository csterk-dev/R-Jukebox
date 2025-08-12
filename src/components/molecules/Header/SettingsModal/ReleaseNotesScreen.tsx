import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Flex, Stack, Text, VStack } from "@chakra-ui/react";
import { FC } from "react";
import { ReleaseNotesList } from "components/atoms/ReleaseNotesList";
import { v1_3ReleaseNotes } from "constants/releaseNotes/v1_3_x";
import { v1_2ReleaseNotes } from "constants/releaseNotes/v1_2_x";
import { v1_1ReleaseNotes } from "constants/releaseNotes/v1_1_x";
import { v1_0ReleaseNotes } from "constants/releaseNotes/v1_0_x";
import { v1_4ReleaseNotes } from "constants/releaseNotes/v1_4_x";
import { v1_5ReleaseNotes } from "constants/releaseNotes/v1_5_x";


const RELEASE_NOTES = [
  {
    title: "Infinite Scroll",
    releases: v1_5ReleaseNotes
  },
  {
    title: "Player Logs",
    releases: v1_4ReleaseNotes
  },
  {
    title: "Auto Complete",
    releases: v1_3ReleaseNotes
  },
  {
    title: "Queue",
    releases: v1_2ReleaseNotes
  },
  {
    title: "History",
    releases: v1_1ReleaseNotes
  },
  {
    title: "Launch",
    releases: v1_0ReleaseNotes
  }
];


export const ReleaseNotesScreen: FC = () => {
  return (
    <Flex flexDirection="column" h="448px">
      <Text
        as="h1"
        px={5}
        py={2}
        textStyle="heading/section"
      >
        Release Notes
      </Text>

      <VStack
        layerStyle="themed-scroll"
        overflowY="auto"
        p="0px 10px 10px 20px"
      >
        <Accordion
          as={Stack}
          width="100%"
          allowToggle
        >
          {RELEASE_NOTES.map(({ title, releases }) => (
            <Stack
              key={title}
              as="ul"
              gap={0}
              listStyleType="none"
              mt={2.5}
              width="100%"
            >
              <Text as="h2" textStyle="heading/sub-section">
                {title}
              </Text>
              {releases.map((notes) => (
                <AccordionItem key={notes.versionNum} _first={{ borderTopWidth: 0 }} as="li">
                  <h3>
                    <Flex
                      _hover={{ bgColor: "transparent" }}
                      alignItems="center"
                      as={AccordionButton}
                      justifyContent="space-between"
                      px={0}
                    >
                      <Text textAlign="start">
                        {`${notes.date}`}
                      </Text>

                      <Flex align="center" gap={2}>
                        <Text textAlign="end">
                          {`v ${notes.versionNum}`}
                        </Text>
                        <AccordionIcon />
                      </Flex>
                    </Flex>
                  </h3>
                  <AccordionPanel pb={4} px={0}>
                    <ReleaseNotesList notes={notes.notes} />
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Stack>
          ))}
        </Accordion>
      </VStack>
    </Flex>
  );
};

ReleaseNotesScreen.displayName = "ReleaseNotesScreen";
