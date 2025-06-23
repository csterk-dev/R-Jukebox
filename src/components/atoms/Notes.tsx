import { Box, Flex, Icon, List, ListItem, ListProps } from "@chakra-ui/react";
import { FC } from "react";
import { HiBugAnt, HiStar, HiWrenchScrewdriver } from "react-icons/hi2";


type NotesProps = ListProps & { notes: ReleaseNote[]; }
export const Notes: FC<NotesProps> = ({ notes, ...props }) => {
  return (
    <List spacing={2} {...props}>
      {notes.map(note => (
        <ListItem key={note.details}>
          <Flex gap={2}>
            <Box mt="2px">
              <Icon
                aria-roledescription="Bullet point"
                as={note.kind == "bugFix" ? HiBugAnt : note.kind == "improvement" ? HiWrenchScrewdriver : HiStar}
                color={note.kind == "bugFix" ? "red.300" : note.kind == "improvement" ? "brand.300" : "yellow.500"}
              />
            </Box>
            <Flex flex={1}>{note.details}</Flex>
          </Flex>
        </ListItem>
      ))}
    </List>
  );
}
Notes.displayName = "Notes";