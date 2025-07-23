import { useAppDispatch, useAppSelector } from '@/Features/hooks/redux'
import { setMusicById } from '@/redux/slice/playlist'
import { IMusic } from '@/types/music'
import { LinearGradient } from 'expo-linear-gradient'
import { Heart, Play } from 'lucide-react-native'
import React from 'react'
import { useWindowDimensions } from 'react-native'
import { Image, Text, View, XStack, YStack } from 'tamagui'

const TopPlayedCard: React.FC<{ data: IMusic; gradientColors: string[], handleList: () => void }> = ({ data, gradientColors, handleList }) => {
  const { width } = useWindowDimensions()
  const dispatch = useAppDispatch();
  const currentplaylist = useAppSelector(state => state.playList);

  const handleplay = () => {
    if (currentplaylist.name === "top") {
      dispatch(setMusicById(data._id))
    } else {
      handleList();
    }
  }
  return (
    <View width={width} alignItems="center" paddingVertical="$3">
      <LinearGradient
        colors={(gradientColors as any)}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 10,
          overflow: 'hidden',
          padding: 16,
          width: 380,
          height: 155,
          shadowColor: '#FF6FB5',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 6,
        }}
      >
        <XStack gap="$4" alignItems="center" onPress={handleplay} pressStyle={{ scale: 0.99 }} >
          <Image
            source={data?.imagePath ? { uri: data.imagePath } : require('@/assets/images/default-m.jpeg')}
            height={120}
            width={120}
            borderRadius={12}
          />

          <YStack flex={1} gap="$2">
            <Text fontSize="$6" color="white" fontWeight="600" numberOfLines={3}>
              {data.title}
            </Text>

            <XStack gap="$4" alignItems="center">
              <XStack alignItems="center" gap="$2">
                <Heart size={24} color="#FF6FB5" />
                <Text color="#fff8" fontSize="$4">
                  {data.isLiked ? 'Liked' : 'Not liked'}
                </Text>
              </XStack>

              <XStack alignItems="center" gap="$2">
                <Play size={20} color="#FFF" />
                <Text color="#fff8" fontSize="$4">
                  {data.played} plays
                </Text>
              </XStack>
            </XStack>
          </YStack>
        </XStack>
      </LinearGradient>
    </View>
  )
}

export default TopPlayedCard
