import { FormattedAudio } from '@/Features/hooks/getAudioDurationFormatted'
import { useAppDispatch, useAppSelector } from '@/Features/hooks/redux'
import { setMusicById, setPlaylistAndPlay } from '@/redux/slice/playlist'
import { X } from 'lucide-react-native'
import React, { useEffect, useState } from 'react'
import { useAudioPro } from 'react-native-audio-pro'
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'
import {
  Image,
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

  // Panel open/close animation
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
    if (currentMusic.name === 'myMusic') {
      dispatch(setMusicById(id))
    } else {
      dispatch(setPlaylistAndPlay({ list: music, id, name: 'myMusic' }))
    }
  }

  const isPlaying = (id: string): boolean =>
    currentMusic.current?._id === id && state === 'PLAYING'

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }))

  // Pulse Animation for playing indicator
  const pulse = useSharedValue(1)

  useEffect(() => {
    if (state === 'PLAYING') {
      pulse.value = withRepeat(
        withTiming(1.4, {
          duration: 700,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      )
    } else {
      pulse.value = withTiming(1)
    }
  }, [state])

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: pulse.value - 0.3,
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
            filteredMusic.map((item, index) => {
              // Card animation values
              const cardTranslate = useSharedValue(20)
              const cardOpacity = useSharedValue(0)

              useEffect(() => {
                cardTranslate.value = withDelay(
                  index * 80,
                  withTiming(0, { duration: 300 })
                )
                cardOpacity.value = withDelay(
                  index * 80,
                  withTiming(1, { duration: 300 })
                )
              }, [])

              const cardAnimStyle = useAnimatedStyle(() => ({
                transform: [{ translateY: cardTranslate.value }],
                opacity: cardOpacity.value,
              }))

              return (
                <Animated.View key={item._id} style={cardAnimStyle}>
                  <XStack
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
                    <Image
                      src={item.imagePath}
                      height={40}
                      width={40}
                      borderRadius={8}
                      resizeMode="cover"
                    />

                    <YStack flex={1}>
                      <Text
                        fontSize={15}
                        fontWeight="700"
                        color="#222"
                        numberOfLines={1}
                        maxWidth={'90%'}
                      >
                        {item.title}
                      </Text>
                      <Text fontSize={13} color="#666">
                        {FormattedAudio(item.duration)}
                      </Text>
                    </YStack>

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
                            shadowOpacity: 0.5,
                            shadowRadius: 4,
                          },
                          pulseStyle,
                        ]}
                      />
                    )}
                  </XStack>
                </Animated.View>
              )
            })
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
