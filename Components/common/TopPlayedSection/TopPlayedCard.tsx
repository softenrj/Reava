import { useAppDispatch, useAppSelector } from '@/Features/hooks/redux'
import { setMusicById } from '@/redux/slice/playlist'
import { IMusic } from '@/types/music'
import { LinearGradient } from 'expo-linear-gradient'
import LottieView from 'lottie-react-native'
import { Heart, Medal, Play } from 'lucide-react-native'
import React from 'react'
import { useWindowDimensions } from 'react-native'
import { Image, Text, View, XStack, YStack } from 'tamagui'

const TopPlayedCard: React.FC<{ data: IMusic, index: number; gradientColors: string[], handleList: () => void }> = ({ data, gradientColors,index = 0, handleList }) => {
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
          width: 370,
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

            <XStack gap="$4" alignItems="center" marginTop={5}>
               <XStack alignItems="center" gap="$2">
                  {
                    index === 0 ? <Medal color={'#fbff00ff'} /> : index === 1 ? <Medal color={'#dededeff'} /> : <Medal color={'#542000ff'} />
                  }
              </XStack>
              <XStack alignItems="center" gap="$2">
                {data.isLiked ? (
                  <LottieView
                    source={require('@/assets/lottie/like.json')}
                    autoPlay
                    loop
                    style={{ width: 80, height: 80, position: 'absolute' , left: -20 }}
                  />
                ) : (
                  <Heart size={26} color="white" />
                )}
              </XStack>
            </XStack>
          </YStack>
        </XStack>
      </LinearGradient>
    </View>
  )
}

export default TopPlayedCard
