import { FormattedAudio } from '@/Features/hooks/getAudioDurationFormatted';
import { IMusic } from '@/types/music';
import Slider from '@react-native-community/slider';
import { ChevronDown, Pause, Play } from 'lucide-react-native';
import React from 'react';
import { AudioPro, useAudioPro } from 'react-native-audio-pro';
import { Avatar, Text, View } from 'tamagui';

export default function MusicBarCard({ toggle, content }: { toggle: (type: string) => void; content: IMusic }) {
  const [progress, setProgress] = React.useState(0);
  const [isSliding, setIsSliding] = React.useState(false);
  const { state, position, duration } = useAudioPro();
  const [isPlaying, setIsPlaying] = React.useState(false);

  const handlePlay = () => {
    if (isPlaying && state === 'PLAYING') {
      AudioPro.pause();
    } else {
      AudioPro.resume();
    }
  };

  // Only update UI progress when user is not sliding
  React.useEffect(() => {
    if (!isSliding) {
      setProgress(position);
    }
  }, [position]);

  // React to player state changes
  React.useEffect(() => {
    setIsPlaying(state === 'PLAYING');
  }, [state]);

  // Seek audio when user finishes sliding
  const handleSlidingComplete = (value: number) => {
    setProgress(value);
    AudioPro.seekTo(value);
    setIsSliding(false);
  };
  

  return (
    <View
      flexDirection="row"
      gap="$4"
      justifyContent="space-between"
      alignItems="center"
      marginVertical="auto"
    >
      <View
        flexDirection="row"
        gap="$2"
        justifyContent="flex-start"
        alignItems="center"
        flex={1}
      >
        <Avatar size="$5" borderRadius="$6" onPress={() => toggle('musicPlayer')} cursor="pointer">
          <Avatar.Image src={content.imagePath || require('@/assets/images/default.jpeg')} />
          <Avatar.Fallback borderColor="red" />
        </Avatar>

        <View alignItems="flex-start">
          <Text color="white" fontSize="$3" maxWidth={'90%'} numberOfLines={2}>
            {content.title}
          </Text>

          <View flexDirection="row" alignItems="center" gap="$0">
            <Text color="white">{FormattedAudio(position)}</Text>
            <Slider
              style={{ height: 24, width: 180 }}
              minimumValue={0}
              maximumValue={content?.duration || 100}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="#999"
              thumbTintColor="#fff"
              value={position}
              onValueChange={(val) => {
                setIsSliding(true);
                setProgress(val);
              }}
              onSlidingComplete={handleSlidingComplete}
            />

            <Text color="white">{FormattedAudio(content.duration)}</Text>
          </View>
        </View>
      </View>

      <View flexDirection="row" alignItems="center" gap="$2" paddingRight={10}>
        {isPlaying ? (
          <Pause size={24} color="white" onPress={handlePlay} />
        ) : (
          <Play size={24} color="white" onPress={handlePlay} />
        )}
        <ChevronDown size={20} color="white" onPress={() => toggle('topNotch')} />
      </View>
    </View>
  );
}
