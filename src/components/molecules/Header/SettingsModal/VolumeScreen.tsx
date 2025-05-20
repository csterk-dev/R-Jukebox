import { Flex, Slider, SliderFilledTrack, SliderTrack, Text } from "@chakra-ui/react";
import { FC } from "react";

type VolumeScreenProps = {
  onChangeEndVolumeHandler: (value: number) => void;
  onChangeVolumeHandler: (value: number) => void;
  volumeLevel: number;
  isVolumeDisabled: boolean;
}

export const VolumeScreen: FC<VolumeScreenProps> = ({ isVolumeDisabled, volumeLevel, onChangeEndVolumeHandler, onChangeVolumeHandler }) => {
  return (
    <Flex py="10px">
      <Flex
        alignItems="center"
        flex={1}
        flexDirection="column"
        gap="10px"
        height="300px"
        pb="10px"
        px="20px"
      >
        <Text>{`${volumeLevel}%`}</Text>
        <Slider
          aria-label="Volume control"
          colorScheme="brand"
          height="100%"
          isDisabled={isVolumeDisabled}
          max={100}
          min={0}
          orientation="vertical"
          step={5}
          value={volumeLevel}
          variant="vertical"
          onChange={val => onChangeVolumeHandler(val)}
          onChangeEnd={val => onChangeEndVolumeHandler(val)}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
        </Slider>
      </Flex>
    </Flex>
  )
}
VolumeScreen.displayName = "VolumeScreen";