import { Dialog, DialogBodyProps, Flex, Slider, Text } from "@chakra-ui/react";
import { FC } from "react";

type VolumeScreenProps = DialogBodyProps & {
  onChangeEndVolumeHandler: (value: number) => void;
  onChangeVolumeHandler: (value: number) => void;
  volumeLevel: number;
  isVolumeDisabled: boolean;
}

export const VolumeScreen: FC<VolumeScreenProps> = ({ isVolumeDisabled, volumeLevel, onChangeEndVolumeHandler, onChangeVolumeHandler, ...props }) => {
  return (
    <Dialog.Body {...props}>
      <Flex
        alignItems="center"
        flex={1}
        flexDirection="column"
        gap={2}
        pb={2}
        px={5}
      >
        <Text>{`${volumeLevel}%`}</Text>
        <Slider.Root          
          aria-label={["Volume control"]}
          disabled={isVolumeDisabled}
          h="350px"
          max={100}
          min={0}
          orientation="vertical"
          step={5}
          value={[volumeLevel]}
          variant="mobileVolume"
          onValueChange={(e) => onChangeVolumeHandler(e.value[0])}
          onValueChangeEnd={(e) => onChangeEndVolumeHandler(e.value[0])}
        >
          <Slider.Control>
            <Slider.Track>
              <Slider.Range />
            </Slider.Track>
          </Slider.Control>
        </Slider.Root>
      </Flex>
    </Dialog.Body>
  )
}
VolumeScreen.displayName = "VolumeScreen";