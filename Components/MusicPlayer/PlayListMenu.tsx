import { FormattedAudio } from '@/Features/hooks/getAudioDurationFormatted';
import { useAppDispatch, useAppSelector } from '@/Features/hooks/redux';
import { playIndexSong } from '@/redux/slice/playlist';
import { Minimize } from 'lucide-react-native';
import React from 'react';
import { useAudioPro } from 'react-native-audio-pro';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';
import { Avatar, ScrollView, Stack, Text, View, XStack } from 'tamagui';

export default function PlayListMenu({ trigger }: { trigger: () => void }) {
  const currentPlayList = useAppSelector(state => state.playList);
  const dispatch = useAppDispatch();
  const { state } = useAudioPro();

  const translateY = useSharedValue(300);
  const opacity = useSharedValue(0);
  const pulse = useSharedValue(1);

  React.useEffect(() => {
    translateY.value = withTiming(0, {
      duration: 400,
      easing: Easing.out(Easing.exp),
    });
    opacity.value = withTiming(1, {
      duration: 400,
      easing: Easing.out(Easing.exp),
    });
  }, []);

  const handleOnClose = () => {
    translateY.value = withTiming(300, {
      duration: 300,
      easing: Easing.out(Easing.exp),
    });
    opacity.value = withTiming(0, {
      duration: 300,
      easing: Easing.out(Easing.exp),
    });
    trigger();
  };

  const handlePlay = (idx: number) => {
    if (currentPlayList.currentMusicIdx !== idx) {
      dispatch(playIndexSong(idx));
    }
  };

  const isPlaying = React.useCallback(
    (id: string) => currentPlayList.current?._id === id && state === 'PLAYING',
    [currentPlayList.current?._id, state]
  );

  React.useEffect(() => {
    pulse.value =
      state === 'PLAYING'
        ? withRepeat(withTiming(1.4, { duration: 700, easing: Easing.inOut(Easing.ease) }), -1, true)
        : withTiming(1);
  }, [state]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: pulse.value - 0.3,
  }));

  const wrapperStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        wrapperStyle,
        {
          position: 'absolute',
          bottom: 30,
          width: '90%',
          alignSelf: 'center',
          zIndex: 60,
          height: '45%',
        },
      ]}
    >
      <ScrollView
        borderRadius={24}
        backgroundColor="#fefefe"
        padding={15}
        showsVerticalScrollIndicator={false}
      >
        <XStack justifyContent="space-between" alignItems="center" marginBottom={10}>
          <Text fontSize={18} fontWeight="700" color="#222">
            Current Playlist
          </Text>
          <Minimize size={22} onPress={handleOnClose} color="#999" />
        </XStack>

        <Stack>
          {currentPlayList.list.map((item, index) => {
            const itemAnim = useSharedValue(30);
            const itemOpacity = useSharedValue(0);

            React.useEffect(() => {
              itemAnim.value = withDelay(
                index * 80,
                withTiming(0, {
                  duration: 350,
                  easing: Easing.out(Easing.exp),
                })
              );
              itemOpacity.value = withDelay(
                index * 80,
                withTiming(1, {
                  duration: 350,
                  easing: Easing.out(Easing.exp),
                })
              );
            }, []);

            const itemStyle = useAnimatedStyle(() => ({
              transform: [{ translateY: itemAnim.value }],
              opacity: itemOpacity.value,
            }));

            return (
              <Animated.View key={item._id + index} style={[itemStyle]}>
                <View
                  onPress={() => handlePlay(index)}
                  backgroundColor="#fff"
                  padding={12}
                  marginTop={12}
                  borderRadius={16}
                  flexDirection="row"
                  alignItems="center"
                  gap={12}
                  shadowColor="#000"
                  shadowOffset={{ width: 0, height: 2 }}
                  shadowOpacity={0.06}
                  shadowRadius={5}
                  borderWidth={1}
                  borderColor="#eee"
                >
                  <Avatar borderRadius={14} size="$5">
                    <Avatar.Image
                      src={item.imagePath || require('@/assets/images/default.jpeg')}
                      alt="cover"
                    />
                    <Avatar.Fallback backgroundColor="#ddd" />
                  </Avatar>

                  <View flex={1}>
                    <View flexDirection="row" justifyContent="space-between" alignItems="center">
                      <View flex={1} minWidth={160}>
                        <Text
                          color={'#222'}
                          fontWeight="700"
                          fontSize={14}
                          numberOfLines={1}
                          maxWidth={'90%'}
                        >
                          {item.title}
                        </Text>
                        <Text color="#888" fontSize={12}>
                          {FormattedAudio(item.duration)}
                        </Text>
                      </View>

                      {isPlaying(item._id) && (
                        <Animated.View
                          style={[
                            {
                              width: 12,
                              height: 12,
                              borderRadius: 6,
                              backgroundColor: '#ff00c3',
                              marginRight: 4,
                              shadowColor: '#ff00c3',
                              shadowOpacity: 0.6,
                              shadowRadius: 4,
                            },
                            pulseStyle,
                          ]}
                        />
                      )}
                    </View>
                  </View>
                </View>
              </Animated.View>
            );
          })}
        </Stack>
      </ScrollView>
    </Animated.View>
  );
}
