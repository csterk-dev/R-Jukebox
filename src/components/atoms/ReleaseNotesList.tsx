import { Box, Flex, Icon, List } from "@chakra-ui/react";
import { FC } from "react";
import { HiBugAnt, HiStar, HiWrenchScrewdriver } from "react-icons/hi2";


type NotesProps = { notes: ReleaseNoteEntry[]; }

/**
 * Renders a html list of release notes.
 */
export const ReleaseNotesList: FC<NotesProps> = ({ notes, ...props }) => {
  return (
    <List.Root gap={2} {...props}>
      {notes.map(note => (
        <List.Item key={note.details}>
          <Flex gap={2}>
            <Box mt="2px">
              <Icon
                aria-roledescription="Bullet point"
                as={note.kind == "bugFix" ? HiBugAnt : note.kind == "improvement" ? HiWrenchScrewdriver : HiStar}
                color={note.kind == "bugFix" ? "red.300" : note.kind == "improvement" ? "primary.300" : "yellow.500"}
              />
            </Box>
            <Flex flex={1}>{note.details}</Flex>
          </Flex>
        </List.Item>
      ))}
    </List.Root>
  );
}
ReleaseNotesList.displayName = "ReleaseNotesList";