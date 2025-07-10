import { FormattedAudio } from '@/Features/hooks/getAudioDurationFormatted'
import { useAppDispatch, useAppSelector } from '@/Features/hooks/redux'
import { setPlaylistAndPlay } from '@/redux/slice/playlist'
import LottieView from 'lottie-react-native'
import { X } from 'lucide-react-native'
import React, { useEffect, useState } from 'react'
import { useAudioPro } from 'react-native-audio-pro'
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import {
  Avatar,
  Input,
  ScrollView,
  Text,
  View,
  XStack,
  YStack,
} from 'tamagui'

export default function SearchPanel({ onClose }: { onClose: () => void }) {
  const music = useAppSelector(state => state.muiscSlice)
  const currentMusic = useAppSelector(state => state.playList)
  const [query, setQuery] = useState('')
  const { state } = useAudioPro()
  const dispatch = useAppDispatch()

  const filteredMusic = music.filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase())
  )

  // Animation values
  const translateY = useSharedValue(600)
  const opacity = useSharedValue(0)

  useEffect(() => {
    translateY.value = withTiming(0, {
      duration: 300,
      easing: Easing.out(Easing.exp),
    })
    opacity.value = withTiming(1, {
      duration: 300,
      easing: Easing.out(Easing.exp),
    })
  }, [])

  const handleClose = () => {
    translateY.value = withTiming(600, {
      duration: 300,
      easing: Easing.out(Easing.exp),
    })
    opacity.value = withTiming(0, {
      duration: 300,
      easing: Easing.out(Easing.exp),
    }, () => {
      runOnJS(onClose)()
    })
  }

  const handlePlay = (id: string) => {
    dispatch(setPlaylistAndPlay({list: music, id, name: "myMusic"}))
  }

  const isPlaying = (id: string): boolean => {
    return currentMusic.current?._id === id && state === 'PLAYING'
  }

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }))

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          zIndex: 999,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#fff',
          paddingHorizontal: 16,
          paddingTop: 30,
        },
        animatedStyle,
      ]}
    >
      {/* Search Bar */}
      <XStack alignItems="center" justifyContent="space-between" marginBottom={16}>
        <Input
          placeholder="Search music..."
          value={query}
          onChangeText={setQuery}
          flex={1}
          borderColor="#ddd"
          borderWidth={1}
          borderRadius={12}
          paddingHorizontal={12}
          height={44}
          backgroundColor="#f5f5f5"
          fontSize={15}
        />
        <X
          size={24}
          color="#666"
          style={{ marginLeft: 12 }}
          onPress={handleClose}
        />
      </XStack>

      {/* Music List */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack gap="$2" paddingBottom={40}>
          {filteredMusic.length > 0 ? (
            filteredMusic.map(item => (
              <XStack
                key={item._id}
                backgroundColor="#f9f9f9"
                padding={12}
                borderRadius={14}
                alignItems="center"
                gap={14}
                shadowColor="#000"
                shadowOpacity={0.04}
                shadowRadius={6}
                borderWidth={1}
                borderColor="#eee"
                onPress={() => handlePlay(item._id)}
              >
                <Avatar circular size="$5">
                  <Avatar.Image src={item.imagePath} alt="cover" />
                  <Avatar.Fallback backgroundColor="#ddd" />
                </Avatar>

                <YStack flex={1}>
                  <Text
                    fontSize={15}
                    fontWeight="700"
                    color="#222"
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                  <Text fontSize={13} color="#666">
                    {FormattedAudio(item.duration)}
                  </Text>
                </YStack>

                {isPlaying(item._id) && (
                  <LottieView
                    source={require('@/assets/lottie/wave.json')}
                    autoPlay
                    loop
                    style={{ width: 36, height: 36 }}
                  />
                )}
              </XStack>
            ))
          ) : (
            <View padding={20} alignItems="center">
              <Text color="#999" fontSize={14}>
                No music found
              </Text>
            </View>
          )}
        </YStack>
      </ScrollView>
    </Animated.View>
  )
}
