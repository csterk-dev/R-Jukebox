import { Button, Divider, Modal, ModalContent, ModalOverlay, ModalProps, Stack, Text } from "@chakra-ui/react";
import { FC } from "react";
import { v1_4ReleaseNotes } from "constants/releaseNotes/v1_4_x";
import { Notes } from "components/atoms/Notes";



type NewUpdateModalProps = Omit<ModalProps, "children"> & { isMobile: boolean }
export const NewUpdateModal: FC<NewUpdateModalProps> = ({ onClose, isOpen, isMobile }) => {
  const newNote = v1_4ReleaseNotes[0];

  return (
    <Modal
      closeOnEsc={false}
      closeOnOverlayClick={false}
      isOpen={isOpen}
      scrollBehavior="inside"
      size={isMobile ? "sm" : "md"}
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
          <Notes notes={newNote.notes} />

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