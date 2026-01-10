import { List } from "@chakra-ui/react";
import { FC } from "react";
import { HiBugAnt, HiStar, HiWrenchScrewdriver } from "react-icons/hi2";


type NotesProps = { notes: ReleaseNoteEntry[]; }

/**
 * Renders a html list of release notes.
 */
export const ReleaseNotesList: FC<NotesProps> = ({ notes, ...props }) => {
  return (
    <List.Root gap={2} variant="plain" {...props}>
      {notes.map(note => (
        <List.Item key={note.details}>
          <List.Indicator color={note.kind == "bugFix" ? "red.300" : note.kind == "improvement" ? "primary.300" : "yellow.500"} asChild>
            {note.kind == "bugFix" ? <HiBugAnt /> : note.kind == "improvement" ? <HiWrenchScrewdriver /> : <HiStar />}
          </List.Indicator>
          {note.details}
        </List.Item>
      ))}
    </List.Root>
  );
}
ReleaseNotesList.displayName = "ReleaseNotesList";