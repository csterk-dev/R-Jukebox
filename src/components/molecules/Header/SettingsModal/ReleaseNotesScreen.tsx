import { Accordion, Dialog, DialogBodyProps, Flex, ScrollArea, Stack, Tag, Text } from "@chakra-ui/react";
import { FC } from "react";
import { ReleaseNotesList } from "@atoms";
import { RELEASE_NOTES_GROUP_TITLES } from "@constants"


export const ReleaseNotesScreen: FC<DialogBodyProps> = (props) => {
  return (
    <Dialog.Body pe="-2" {...props}>
      <Flex align="center" minH="36px">
        <Text as="h1" textStyle="heading/section">
          Release Notes
        </Text>
      </Flex>
      <ScrollArea.Root h="100%">
        <ScrollArea.Scrollbar />
        <ScrollArea.Viewport>
          <ScrollArea.Content pe="4">
            <Accordion.Root
              as={Stack}
              width="100%"
              collapsible
            >
              {RELEASE_NOTES_GROUP_TITLES.map(({ groupTitle, groupedNotes }) => (
                <Stack
                  key={groupTitle}
                  as="ul"
                  gap={0}
                  listStyleType="none"
                  position="relative"
                  width="100%"
                >
                  <Flex
                    align="flex-end"
                    bg="surface.foreground"
                    position="sticky"
                    top={0}
                  >
                    <Text
                      as="h2"
                      mt={2.5}
                      pb={1}
                      textStyle="heading/sub-section"
                    >
                      {groupTitle}
                    </Text>
                  </Flex>
                  {groupedNotes.map(notes => (
                    <Accordion.Item
                      key={notes.versionNum}
                      _first={{ borderTopWidth: 0 }}
                      as="li"
                      value={notes.versionNum}
                    >
                      <Accordion.ItemTrigger>
                        <Flex
                          _hover={{ bgColor: "transparent" }}
                          alignItems="center"
                          justifyContent="space-between"
                          width="100%"
                        >
                          <Text pl="2px" textAlign="start">
                            {`${notes.date}`}
                          </Text>

                          <Flex align="center" gap={2}>
                            <Tag.Root colorPalette="brand">
                              <Tag.Label>{`v ${notes.versionNum}`}</Tag.Label>
                            </Tag.Root>
                            <Accordion.ItemIndicator />
                          </Flex>
                        </Flex>
                      </Accordion.ItemTrigger>
                      <Accordion.ItemContent pb={4} px={0}>
                        <ReleaseNotesList notes={notes.notes} />
                      </Accordion.ItemContent>
                    </Accordion.Item>
                  ))}
                </Stack>
              ))}
            </Accordion.Root>

          </ScrollArea.Content>
        </ScrollArea.Viewport>
      </ScrollArea.Root>
    </Dialog.Body>
  );
};

ReleaseNotesScreen.displayName = "ReleaseNotesScreen";
