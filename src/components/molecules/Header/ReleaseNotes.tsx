import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, HStack } from "@chakra-ui/react";
import { Notes } from "components/atoms/Notes";
import { FC } from "react";


type ReleaseNotesAccordionProps = { releaseNotes: ReleaseNotes }
export const ReleaseNotesAccordion: FC<ReleaseNotesAccordionProps> = ({ releaseNotes }) => {
  return (
    <Accordion width="100%" allowToggle>
      {releaseNotes.map(release => (
        <AccordionItem key={release.title}>
          <h2>
            <HStack
              _hover={{ bgColor: "transparent" }}
              as={AccordionButton}
              px={0}
            >
              <Box as="span" flex={1} textAlign="left">
                {release.title}
              </Box>
              <AccordionIcon />
            </HStack>
          </h2>
          <AccordionPanel pb={4} px={0}>
            <Notes date={release.date} notes={release.notes} />
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
ReleaseNotesAccordion.displayName = "ReleaseNotesAccordion";