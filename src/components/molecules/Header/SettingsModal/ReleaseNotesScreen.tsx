import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Flex, Stack, Tag, Text, VStack } from "@chakra-ui/react";
import { FC } from "react";
import { ReleaseNotesList } from "components/atoms/ReleaseNotesList";
import { RELEASE_NOTES_GROUP_TITLES } from "constants/releaseNotes"


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
          {RELEASE_NOTES_GROUP_TITLES.map(({ groupTitle, groupedNotes }) => (
            <Stack
              key={groupTitle}
              as="ul"
              gap={0}
              listStyleType="none"
              mt={2.5}
              position="relative"
              width="100%"
            >
              <Flex 
                align="flex-end"
                bg="surface.foreground" 
                position="sticky" 
                top={0}
              >
                <Text as="h2" textStyle="heading/sub-section">
                  {groupTitle}
                </Text>
              </Flex>
              {groupedNotes.map(notes => (
                <AccordionItem key={notes.versionNum} _first={{ borderTopWidth: 0 }} as="li">
                  <h3>
                    <Flex
                      _hover={{ bgColor: "transparent" }}
                      alignItems="center"
                      as={AccordionButton}
                      justifyContent="space-between"
                      px={0}
                    >
                      <Text pl="2px" textAlign="start">
                        {`${notes.date}`}
                      </Text>

                      <Flex align="center" gap={2}>
                        <Tag colorScheme="brand">
                          {`v ${notes.versionNum}`}
                        </Tag>
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
