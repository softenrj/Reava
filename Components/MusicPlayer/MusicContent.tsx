import { FormattedAudio } from '@/Features/hooks/getAudioDurationFormatted';
import { useAppDispatch, useAppSelector } from '@/Features/hooks/redux';
import { setMusicLoop } from '@/Features/musicService';
import { nextSong, prevSong, setShuffleMusic, updateMusic } from '@/redux/slice/playlist';
import { API_LIKE_MUSIC, API_UNLIKE_MUSIC } from '@/utils/api/APIConstant';
import { postApi } from '@/utils/endPoints/common';
import Slider from '@react-native-community/slider';
import LottieView from 'lottie-react-native';
import {
    ChevronLeft,
    ChevronRight,
    ClockFading,
    Heart,
    Menu,
    Pause,
    Play,
    Repeat,
    Shuffle,
} from 'lucide-react-native';
import React from 'react';
import { AudioPro, useAudioPro } from 'react-native-audio-pro';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { Image, ScrollView, Text, View, XStack } from 'tamagui';

export default function MusicContent({ listTrigger }: { listTrigger: () => void }) {
    const [isLike, setLike] = React.useState(false);
    const [isSliding, setIsSliding] = React.useState(false);
    const [isPlaying, setIsPlaying] = React.useState(false);
    const dispatch = useAppDispatch();
    const progress = useSharedValue(0);
    const animatedValue = useSharedValue(0);
    const [likeprocess, setLikeprocess] = React.useState(false);

    const [repeat, setRepeat] = React.useState(false);
    const [shuffle, setShuffle] = React.useState(false);

    const currentMusic = useAppSelector(state => state.playList.current);
    const { state, position, duration } = useAudioPro();

    const handlePlayPause = () => {
        if (isPlaying && state === 'PLAYING') {
            AudioPro.pause();
        } else {
            AudioPro.resume();
        }
    };

    const handleSlidingComplete = (value: number) => {
        progress.value = value;
        AudioPro.seekTo(value);
        setIsSliding(false);
    };

    const animatedTrackStyle = useAnimatedStyle(() => ({
        width: `${animatedValue.value}%`,
    }));


    const handleLikeUnLike = () => {
        if (isLike) {
            setLike(false);
            handleUnLike();
        } else {
            setLike(true);
            handleLike();
        }
    }

    const handleLike = async () => {
        try {
            if (likeprocess || !currentMusic || isLike) return;
            setLikeprocess(true);
            const music = await postApi({
                url: API_LIKE_MUSIC + `/${currentMusic?._id}`
            })
            dispatch(updateMusic(music as any))
            setLikeprocess(false);
        } catch (err) {
            console.log(err);
        }
    }

    const handleUnLike = async () => {
        try {
            if (likeprocess || !currentMusic || !isLike) return;
            setLikeprocess(true);
            const music = await postApi({
                url: API_UNLIKE_MUSIC + `/${currentMusic?._id}`
            })
            dispatch(updateMusic(music as any))
            setLikeprocess(false);
        } catch (err) {
            console.log(err);
        }
    }

    const handleNext = () => {
        dispatch(nextSong())
    }

    const handlePrev = () => {
        dispatch(prevSong())
    }

    const handleTogleRepeat = async () => {
        const newRepeat = !repeat;
        setRepeat(newRepeat);
        setMusicLoop(newRepeat)
    };

    const handleTogleShuffle = () => {
        dispatch(setShuffleMusic(shuffle))
        setShuffle(prev => !prev)
    }

    React.useEffect(() => {
        setLike(!!currentMusic?.isLiked)
    }, [currentMusic])

    React.useEffect(() => {
        setIsPlaying(state === 'PLAYING');
    }, [state]);

    React.useEffect(() => {
        if (!isSliding && duration > 0) {
            progress.value = position;
            animatedValue.value = withTiming((position / duration) * 100, {
                duration: 400,
                easing: Easing.out(Easing.ease),
            });
        }
    }, [position, duration]);

    return (
        <ScrollView
            position="absolute"
            bottom={30}
            width="90%"
            alignSelf="center"
            borderRadius={20}
            zIndex={57}
            height="90%"
            showsVerticalScrollIndicator={false}
        >
            <View
                backgroundColor="rgba(20,20,20,0.95)"
                borderRadius={20}
                padding={20}
                shadowColor="#000"
                shadowOffset={{ width: 0, height: 6 }}
                shadowOpacity={0.3}
                shadowRadius={10}
                marginTop={260}
            >
                {/* Top Section */}
                <XStack justifyContent="space-between" marginBottom={10}>
                    <View
                        width={24}
                        height={24}
                        justifyContent="center"
                        alignItems="center"
                        onPress={handleLikeUnLike}
                    >
                        {isLike ? (
                            <LottieView
                                source={require('@/assets/lottie/like.json')}
                                autoPlay
                                loop={false}
                                style={{ width: 60, height: 60 }}
                            />
                        ) : (
                            <Heart size={20} color="white" />
                        )}
                    </View>
                    <Menu size={20} color="white" onPress={listTrigger} />
                </XStack>

                {/* Song Details */}
                <View alignItems="center">
                    <Image src={currentMusic?.imagePath || require('@/assets/images/default-m.jpeg')} width={180} height={180} borderRadius={10} />
                    <Text color="white" fontWeight="700" textAlign='center' fontSize="$7" marginTop={10}>
                        {currentMusic?.title} 
                    </Text>
                    <Text color="gray" fontSize="$5">🙌🍁❤️</Text>
                </View>

                {/* Control Icons */}
                <View flexDirection="row" justifyContent="space-between" marginBottom={12}>
                    <Shuffle color={shuffle ? '#FF69B4' : 'rgba(255, 255, 255, 0.8)'} size={22} onPress={handleTogleShuffle} />
                    <Repeat
                        color={repeat ? '#FF69B4' : 'rgba(255, 255, 255, 0.8)'}
                        onPress={handleTogleRepeat}
                        size={22}
                    />
                    <ClockFading color={'#ffff'} style={{ display: 'none' }} />
                </View>

                {/* Progress Bar */}
                <View width="100%" marginBottom={10} position="relative" height={30} justifyContent="center">
                    <View flexDirection="row" justifyContent="space-between" marginBottom={4}>
                        <Text color="white" fontSize="$3">{FormattedAudio(progress.value)}</Text>
                        <Text color="white" fontSize="$3">{FormattedAudio(duration)}</Text>
                    </View>

                    <View
                        width="100%"
                        height={6}
                        backgroundColor="#444"
                        borderRadius={999}
                        position="absolute"
                        top={12}
                        zIndex={1}
                    />

                    <Animated.View
                        style={[
                            {
                                height: 6,
                                backgroundColor: '#fff',
                                borderRadius: 999,
                                position: 'absolute',
                                top: 12,
                                left: 0,
                                zIndex: 2,
                            },
                            animatedTrackStyle,
                        ]}
                    />

                    <Slider
                        style={{
                            width: '100%',
                            height: 30,
                        }}
                        minimumValue={0}
                        maximumValue={duration || 100}
                        minimumTrackTintColor="transparent"
                        maximumTrackTintColor="transparent"
                        thumbTintColor="transparent"
                        value={position}
                        onValueChange={(val) => {
                            setIsSliding(true);
                            progress.value = val;
                            animatedValue.value = (val / duration) * 100;
                        }}
                        onSlidingComplete={handleSlidingComplete}
                    />
                </View>

                {/* Play Controls */}
                <View flexDirection="row" justifyContent="space-evenly" alignItems="center" marginTop={10}>
                    <View
                        backgroundColor="#2e2e2e"
                        borderRadius={999}
                        height={40}
                        width={40}
                        alignItems="center"
                        justifyContent="center"
                        onPress={handlePrev}
                    >
                        <ChevronLeft color="white" />
                    </View>

                    <View
                        backgroundColor="#fff"
                        borderRadius={999}
                        height={60}
                        width={60}
                        alignItems="center"
                        justifyContent="center"
                        onPress={handlePlayPause}
                    >
                        {isPlaying ? <Pause color="#000" /> : <Play color="#000" />}
                    </View>

                    <View
                        backgroundColor="#2e2e2e"
                        borderRadius={999}
                        height={40}
                        width={40}
                        alignItems="center"
                        justifyContent="center"
                        onPress={handleNext}
                    >
                        <ChevronRight color="white" />
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}
