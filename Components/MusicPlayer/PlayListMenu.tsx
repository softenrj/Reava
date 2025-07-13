import { FormattedAudio } from '@/Features/hooks/getAudioDurationFormatted';
import { useAppDispatch, useAppSelector } from '@/Features/hooks/redux';
import { playIndexSong } from '@/redux/slice/playlist';
import LottieView from 'lottie-react-native';
import { Minimize } from 'lucide-react-native';
import React from 'react';
import { useAudioPro } from 'react-native-audio-pro';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { Avatar, ScrollView, Stack, Text, View, XStack } from 'tamagui';

export default function PlayListMenu({ trigger }: { trigger: () => void }) {
    const translateY = useSharedValue(300);
    const opacity = useSharedValue(0);
    const currentPlayList = useAppSelector(state => state.playList);
    const dispatch = useAppDispatch()
    const { state } = useAudioPro()

    React.useEffect(() => {
        translateY.value = withTiming(0, {
            duration: 300,
            easing: Easing.out(Easing.exp),
        });
        opacity.value = withTiming(1, {
            duration: 300,
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
        if (currentPlayList.currentMusicIdx === idx) return;
        dispatch(playIndexSong(idx));
    }

    const isPlaying = React.useCallback((id: string): boolean => {
        return (currentPlayList.current?._id === id && state === "PLAYING");
    }, [currentPlayList.current?._id, state]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
        opacity: opacity.value,
    }));

    return (
        <Animated.View
            style={[
                animatedStyle,
                {
                    position: 'absolute',
                    bottom: 29.5,
                    width: '85%',
                    alignSelf: 'center',
                    zIndex: 60,
                    height: '45%',
                },
            ]}
        >
            <ScrollView
                borderRadius={20}
                backgroundColor="#f9f9f9"
                padding={15}
                showsVerticalScrollIndicator={false}
            >

                <XStack
                    alignItems="center"
                    justifyContent="space-between"
                    marginBottom={10}
                >
                    <Text fontSize={18} fontWeight="700" color="#333">
                        Current Playlist
                    </Text>
                    <Minimize size={22} onPress={handleOnClose} color="#999" />
                </XStack>

                {/* Songs List */}
                <Stack>
                    {currentPlayList.list.map((item, key) => (
                        <View
                            key={key}
                            backgroundColor="#ffffff"
                            padding={12}
                            borderRadius={14}
                            flexDirection="row"
                            alignItems="center"
                            gap={12}
                            marginTop={10}
                            shadowColor="#000"
                            shadowOffset={{ width: 0, height: 2 }}
                            shadowOpacity={0.05}
                            shadowRadius={4}
                            borderWidth={1}
                            borderColor="#eee"
                            onPress={() => handlePlay(key)}
                        >
                            <Avatar borderRadius={12} size="$5">
                                <Avatar.Image src={item.imagePath || require('@/assets/images/default.jpeg')} alt="Playlist Cover" />
                                <Avatar.Fallback backgroundColor="#ddd" />
                            </Avatar>

                            <Stack>
                                <View flexDirection='row' justifyContent='space-between' alignItems="center">
                                    <View flex={1} minWidth={160}>
                                        <Text
                                            color={isPlaying(item._id) ? "#1DB954" : "#222"}
                                            numberOfLines={1}
                                            fontWeight="700"
                                            fontSize={14}
                                        >
                                            {item.title}
                                        </Text>
                                        <Text color="#666" fontSize={12}>
                                            Duration: {FormattedAudio(item.duration)}
                                        </Text>
                                    </View>

                                    {isPlaying(item._id) && (
                                        <LottieView
                                            source={require('@/assets/lottie/wave.json')}
                                            autoPlay
                                            loop
                                            style={{ width: 40, height: 60 }}
                                        />
                                    )}
                                </View>

                            </Stack>

                        </View>
                    ))}
                </Stack>
            </ScrollView>
        </Animated.View>

    );
}
