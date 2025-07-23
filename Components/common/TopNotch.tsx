import { FormattedAudio } from '@/Features/hooks/getAudioDurationFormatted'
import { useAppSelector } from '@/Features/hooks/redux'
import LottieView from 'lottie-react-native'
import React, { useEffect } from 'react'
import { useAudioPro } from 'react-native-audio-pro'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated'
import { Avatar, SizableText, Text, View, useWindowDimensions } from 'tamagui'

export default function TopNotch({ toggle }: { toggle: (topNotch: string) => void }) {
    const { state, position, duration, playingTrack, playbackSpeed, volume, error } = useAudioPro();
    const { width, height } = useWindowDimensions()
    const translateX = useSharedValue(0)
    const translateY = useSharedValue(-100)
    const opacity = useSharedValue(0)
    const currentMusic = useAppSelector(state => state.playList).current


    useEffect(() => {
        translateY.value = withTiming(10, { duration: 400 })
        opacity.value = withTiming(1, { duration: 400 })
    }, [])

    const dismiss = () => {
        toggle('topNotch');
        opacity.value = withTiming(0, { duration: 300 })
        translateY.value = withTiming(-200, { duration: 300 })
    }

    const gesture = Gesture.Pan()
        .onUpdate((e) => {
            translateX.value = e.translationX
            translateY.value = e.translationY
        })
        .onEnd(() => {
            // If it's moved too far off screen vertically or horizontally, dismiss it
            const tooFar =
                Math.abs(translateX.value) > width / 4 || Math.abs(translateY.value) > height / 4

            if (tooFar) {
                runOnJS(dismiss)()
            } else {
                // Snap back to original position
                translateX.value = withSpring(0)
                translateY.value = withSpring(10)
            }
        })

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value - (width / 4) },
            { translateY: translateY.value },
        ],
        opacity: opacity.value,
    }));

    return (
        <GestureDetector gesture={gesture}>
            <Animated.View
                style={[
                    animatedStyle,
                    {
                        position: 'absolute',
                        top: 0,
                        left: width / 2,
                        zIndex: 10,
                    },
                ]}
            >
                <View
                    backgroundColor={'black'}
                    minWidth={'$10'}
                    maxHeight={'$3'}
                    borderRadius={'$12'}
                    padding={5}
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    gap={2}
                    onLongPress={dismiss}
                >
                    <Avatar size={'$2'} circular cursor="pointer">
                        <Avatar.Image src={currentMusic?.imagePath || require('@/assets/images/default.jpeg')} />
                        <Avatar.Fallback borderColor="red" />
                    </Avatar>

                    <View marginHorizontal={'$2'}>
                        <SizableText
                            maxWidth={'$8'}
                            textOverflow="ellipsis"
                            numberOfLines={1}
                            color="white"
                            fontSize={'$1'}
                            marginBottom={-6}
                        >
                            {currentMusic?.title}
                        </SizableText>
                        <Text
                            color="white"
                            maxWidth={'$8'}
                            textOverflow="ellipsis"
                            numberOfLines={1}
                            fontSize={'$1'}
                        >
                            TimeLeft: {FormattedAudio(duration - position)}
                        </Text>
                    </View>

                    <LottieView
                        source={require('@/assets/lottie/Electric_guitar_music.json')}
                        autoPlay
                        loop
                        style={{ width: 60, height: 60, marginRight: -18 }}
                    />
                </View>
            </Animated.View>
        </GestureDetector>
    )
}
