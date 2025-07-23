import { useAppSelector } from '@/Features/hooks/redux';
import { AVPlaybackStatus, ResizeMode, Video } from 'expo-av'; // Changed to expo-av
import { Minimize2 } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { View } from 'tamagui';
import MusicOverLay from './MusicOverLay';

const { height } = Dimensions.get('window');

export default function MusicPlayer({ toggle }: { toggle?: () => void }) {
  const currentMusic = useAppSelector(state => state.playList.current);
  const videoRef = useRef<Video>(null);
  const [videoStatus, setVideoStatus] = useState<AVPlaybackStatus | null>(null);

  const translateY = useSharedValue(height);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withTiming(0, { duration: 400 });
    opacity.value = withTiming(1, { duration: 400 });
  }, []);

  useEffect(() => {
    if (videoRef.current && videoStatus?.isLoaded === false) {
      videoRef.current.playAsync();
    }
  }, [videoStatus]);

  const animateStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const handleClose = () => {
    translateY.value = withTiming(height, { duration: 400 });
    opacity.value = withTiming(0, { duration: 400 }, (finished) => {
      if (finished && toggle) runOnJS(toggle)();
    });
  };

  return (
    <Animated.View
      style={[
        animateStyle,
        {
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          zIndex: 50,
          backgroundColor: 'rgba(255, 255, 255, 1)',
        },
      ]}
    >
      <View flex={1} justifyContent="center" alignItems="center">
        <Video
          ref={videoRef}
          source={currentMusic?.videoPath
            ? { uri: currentMusic.videoPath }
            : require('@/assets/videos/default.mp4')
          }
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            borderRadius: 16
          }}
          useNativeControls={false}
          resizeMode={ResizeMode.COVER}
          isMuted={true}
          isLooping
          shouldPlay
          onPlaybackStatusUpdate={status => setVideoStatus(status)}
          onError={error => console.log('Video Error:', error)}
        />

        <View
          position="absolute"
          top={15}
          right={15}
          zIndex={100}
          backgroundColor="rgba(0,0,0,0.4)"
          padding={8}
          borderRadius={12}
          onPress={handleClose}
        >
          <Minimize2 color="#fff" size={20} />
        </View>

        <MusicOverLay />
      </View>
    </Animated.View>
  );
}