import { useAppDispatch, useAppSelector } from '@/Features/hooks/redux';
import { setMusicById } from '@/redux/slice/playlist';
import React, { useEffect, useRef } from 'react';
import { Dimensions } from 'react-native';
import PagerView from 'react-native-pager-view';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { View } from 'tamagui';
import MusicBarCard from '../MusicPlayer/MusicBarCard';

const { height } = Dimensions.get('window');

export default function MusicBar({ toggle }: { toggle: (type: string) => void }) {
  const currentplaylist = useAppSelector((state) => state.playList);
  const dispatch = useAppDispatch();
  const translateY = useSharedValue(200);
  const opacity = useSharedValue(0);
  const pagerRef = useRef<PagerView>(null);

  useEffect(() => {
    translateY.value = withTiming(0, { duration: 400 });
    opacity.value = withTiming(1, { duration: 400 });
  }, []);


  const handleMusicChange = (id: string) => {
    dispatch(setMusicById(id));
  }


  useEffect(() => {
    if (
      pagerRef.current &&
      currentplaylist.currentMusicIdx < currentplaylist.list.length
    ) {
      pagerRef.current.setPage(currentplaylist.currentMusicIdx);
    }
  }, [currentplaylist.currentMusicIdx]);


  const animationStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const handleClose = (type: string) => {
    if (type === 'topNotch') {
      translateY.value = withTiming(height, { duration: 400 });
      opacity.value = withTiming(0, { duration: 300 }, (finished) => {
        if (finished && toggle) runOnJS(toggle)(type);
      });
      return;
    }
    runOnJS(toggle)('musicPlayer');
  };


  return (
    <Animated.View
      style={[
        animationStyle,
        {
          position: 'absolute',
          bottom: 2,
          left: 0,
          right: 0,
          width: '100%',
        },
      ]}
    >
      <View backgroundColor="black" borderRadius="$8" padding="$2">
        {currentplaylist.list.length > 0 && (
          <PagerView
            ref={pagerRef}
            style={{ width: '100%', height: 60 }}
            onPageSelected={(e) => {
              const selectedIndex = e.nativeEvent.position;
              const selectedTrack = currentplaylist.list[selectedIndex];
              if (selectedTrack) {
                handleMusicChange(selectedTrack._id);
              }
            }}
          >
            {currentplaylist.list.map((track) => (
              <View key={track._id}>
                <MusicBarCard content={track} toggle={handleClose} />
              </View>
            ))}
          </PagerView>
        )}
      </View>
    </Animated.View>
  );
}
