import { Button, Divider, Modal, ModalContent, ModalOverlay, ModalProps, Stack, Text } from "@chakra-ui/react";
import { FC, useMemo } from "react";
import { ReleaseNotesList } from "components/atoms/ReleaseNotesList";
import { ALL_RELEASE_NOTES } from "constants/releaseNotes";


type NewUpdateModalProps = Omit<ModalProps, "children"> & {
  currentVersionNumber: VersionNumber;
};

/** A simple modal that displays the most recent release's patch & feature notes. */
export const NewUpdateModal: FC<NewUpdateModalProps> = ({ onClose, isOpen, currentVersionNumber }) => {
  const latestUpdateNotes = ALL_RELEASE_NOTES.find(note => note.versionNum === currentVersionNumber);
  const showModal = useMemo(() => !!latestUpdateNotes && isOpen, [isOpen, latestUpdateNotes]);

  return (
    <Modal
      closeOnEsc={false}
      closeOnOverlayClick={false}
      isOpen={showModal}
      scrollBehavior="inside"
      size={{
        base: "sm",
        lg: "md"
      }}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent
        boxShadow={0}
        layerStyle="themed-scroll"
        overflowY="auto"
        userSelect="none"
      >
        <Stack p="8px 20px 20px">
          <Text as="h1" fontSize="32" fontWeight="semibold">{`${latestUpdateNotes?.title}`}</Text>

          <Text
            as="h2"
            color="text.heading-subtle"
            fontSize="24"
            fontWeight="semibold"
          >
            What's new?
          </Text>
          <Divider />
          <Text textStyle="body/label">{latestUpdateNotes?.date}</Text>
          <ReleaseNotesList notes={latestUpdateNotes?.notes ?? []} />

          <Button
            colorScheme="brand"
            mt={4}
            pb="2px"
            size="md"
            variant="solid"
            onClick={onClose}
          >
            Lets go!
          </Button>
        </Stack>
      </ModalContent>
    </Modal>
  );
};
NewUpdateModal.displayName = "NewUpdateModal";