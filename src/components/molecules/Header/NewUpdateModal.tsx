import { Button, Flex, Modal, ModalContent, ModalOverlay, ModalProps, Text } from "@chakra-ui/react";
import { FC } from "react";
import { v1_3ReleaseNotes } from "constants/releaseNotes/v1_3_x";
import { Notes } from "components/atoms/Notes";



type NewUpdateModalProps = Omit<ModalProps, "children"> & { isMobile: boolean }
export const NewUpdateModal: FC<NewUpdateModalProps> = ({ onClose, isOpen, isMobile }) => {

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
        _dark={{ bg: "neutral.700" }}
        bg="white"
        boxShadow={0}
        overflowY="auto"
        userSelect="none"
      >
        <Flex flexDirection="column" p="10px 20px 20px">
          <Text as="h1" fontSize="32" fontWeight={600}>{`${v1_3ReleaseNotes[0].title}`}</Text>
          <Text
            as="h2"
            fontSize="24"
            fontWeight={500}
            opacity={0.7}
          >
            What's new?
          </Text>
          <Notes date={v1_3ReleaseNotes[0].date} mt="10px" notes={v1_3ReleaseNotes[0].notes} />

          <Button
            colorScheme="brand"
            mt="30px"
            pb="2px"
            onClick={onClose}
          >
            Lets go!
          </Button>
        </Flex>
      </ModalContent>
    </Modal>
  );
};
NewUpdateModal.displayName = "NewUpdateModal";