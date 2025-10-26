import { Button, Divider, Modal, ModalContent, ModalOverlay, ModalProps, Stack, Text } from "@chakra-ui/react";
import { FC } from "react";
import { ReleaseNotesList } from "components/atoms/ReleaseNotesList";
import { v1_5ReleaseNotes } from "constants/releaseNotes/v1_5_x";


type NewUpdateModalProps = Omit<ModalProps, "children">;

/** A simple modal that displays the most recent release's patch & feature notes. */
export const NewUpdateModal: FC<NewUpdateModalProps> = ({ onClose, isOpen }) => {
  const newNote = v1_5ReleaseNotes[0];

  return (
    <Modal
      closeOnEsc={false}
      closeOnOverlayClick={false}
      isOpen={isOpen}
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
          <Text as="h1" fontSize="32" fontWeight="semibold">{`${newNote.title}`}</Text>

          <Text
            as="h2"
            color="text.heading-subtle"
            fontSize="24"
            fontWeight="semibold"
          >
            What's new?
          </Text>
          <Divider />
          <Text textStyle="body/label">{newNote.date}</Text>
          <ReleaseNotesList notes={newNote.notes} />

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