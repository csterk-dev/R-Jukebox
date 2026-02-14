import { Dialog, DialogBodyProps, Flex, Slider, SliderValueChangeDetails, Text } from "@chakra-ui/react";
import { FC, useCallback } from "react";

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
          onValueChange={useCallback((e: SliderValueChangeDetails) => onChangeVolumeHandler(e.value[0]), [onChangeVolumeHandler])}
          onValueChangeEnd={useCallback((e:SliderValueChangeDetails) => onChangeEndVolumeHandler(e.value[0]), [onChangeEndVolumeHandler])}
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