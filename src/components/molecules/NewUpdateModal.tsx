import { Button, Dialog, Portal, Separator, Stack, Text } from "@chakra-ui/react";
import { FC, useMemo } from "react";
import { ReleaseNotesList } from "@atoms";
import { ALL_RELEASE_NOTES } from "@constants";


type NewUpdateModalProps = {
  currentVersionNumber: VersionNumber;
  isOpen: boolean;
  onClose: () => void;
};

/** A simple modal that displays the most recent release's patch & feature notes. */
export const NewUpdateModal: FC<NewUpdateModalProps> = ({ onClose, isOpen, currentVersionNumber }) => {
  const latestUpdateNotes = ALL_RELEASE_NOTES.find(note => note.versionNum === currentVersionNumber);
  const showModal = useMemo(() => !!latestUpdateNotes && isOpen, [isOpen, latestUpdateNotes]);

  return (
    <Dialog.Root
      closeOnEscape={false}
      closeOnInteractOutside={false}
      open={showModal}
      scrollBehavior="inside"
      size={{
        base: "sm",
        lg: "md"
      }}
      onOpenChange={(e) => !e.open && onClose()}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content
            boxShadow="none"
            layerStyle="themed-scroll"
            overflowY="auto"
            userSelect="none"
          >
            <Stack p="8px 20px 20px">
              <Text as="h1" fontSize="32" fontWeight="semibold">{`${latestUpdateNotes?.title}`}</Text>

              <Text
                as="h2"
                color="fg.heading-subtle"
                fontSize="24"
                fontWeight="semibold"
              >
                What's new?
              </Text>
              <Separator />
              <Text textStyle="body/label">{latestUpdateNotes?.date}</Text>
              <ReleaseNotesList notes={latestUpdateNotes?.notes ?? []} />

              <Button
                colorPalette="brand"
                mt={4}
                pb="2px"
                size="md"
                variant="solid"
                onClick={onClose}
              >
                Lets go!
              </Button>
            </Stack>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
NewUpdateModal.displayName = "NewUpdateModal";