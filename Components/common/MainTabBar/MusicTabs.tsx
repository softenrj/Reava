import { FormattedAudio } from '@/Features/hooks/getAudioDurationFormatted'
import { useAppDispatch, useAppSelector } from '@/Features/hooks/redux'
import { setMusicById, setPlaylistAndPlay } from '@/redux/slice/playlist'
import { IMusic } from '@/types/music'
import { LinearGradient } from 'expo-linear-gradient'
import LottieView from 'lottie-react-native'
import { Heart, Play, RefreshCcw } from 'lucide-react-native'
import React from 'react'
import { useWindowDimensions } from 'react-native'
import { Image, ScrollView, Text, View, XStack, YStack } from 'tamagui'

const MusicTabs: React.FC<{ name: string, music: IMusic[], isLoading?: boolean, handleRefresh?: () => void }> = ({ name = "My Music", music = [], isLoading, handleRefresh }) => {
  const { width } = useWindowDimensions();
  const currentPlayList = useAppSelector(state => state.playList);
  const dispatch = useAppDispatch();

  const handlePlay = (id: string) => {
    if (currentPlayList.name === name) {
      dispatch(setMusicById(id))
    } else {
      dispatch(setPlaylistAndPlay({ list: music, id: id, name: name }))
    }
  }

  if (!Array.isArray(music) || music.length === 0) {
    return (
      <>
        {name.toLocaleLowerCase().trim() === "suggestions" &&
          <View>
            {isLoading && <XStack alignItems="center" justifyContent='center' gap="$3" padding="$2">
              <LottieView
                source={require('@/assets/lottie/ai.json')}
                loop
                autoPlay
                style={{ width: 160, height: 160 }}
              />


            </XStack>}
            {!isLoading && (
              <XStack alignItems="center" gap="$2" marginBottom={10} onPress={handleRefresh}>
                <RefreshCcw size={18} color="#333" />
                <Text fontSize="$6" fontWeight="800" color="rgba(0, 0, 97, 1)">
                  Reload
                </Text>
              </XStack>
            )}
          </View>
        }
        <View padding="$4" alignItems="center" justifyContent="center">
          <Text fontSize="$6" color="#888">
            No music found in {name}
          </Text>
        </View></>
    )
  }

  return (
    <ScrollView >
      {name.toLocaleLowerCase().trim() === "suggestions" &&
        <View>
          {isLoading && <XStack alignItems="center" justifyContent='center' gap="$3" padding="$2">
            <LottieView
              source={require('@/assets/lottie/ai.json')}
              loop
              autoPlay
              style={{ width: 160, height: 160 }}
            />


          </XStack>}
          {!isLoading && (
            <XStack alignItems="center" gap="$2" marginBottom={10} onPress={handleRefresh}>
              <RefreshCcw size={18} color="#333" />
              <Text fontSize="$6" fontWeight="800" color="rgba(0, 0, 97, 1)">
                Reload
              </Text>
            </XStack>
          )}
        </View>
      }

      {!isLoading && music.map((item, key) => (
        <View
          key={key}
          onPress={() => handlePlay(item._id)}
          pressStyle={{ scale: 0.98 }}
        >
          <YStack
            width={width * 0.86}
            padding={8}
            borderRadius={16}
            marginBottom={16}
            backgroundColor="#fff"
            borderColor={'rgba(129, 136, 166, 0.51)'}
            borderWidth={1}
            flexDirection="row"
            alignItems="center"
            gap={16}
          >
            <Image
              src={item.imagePath || require('@/assets/images/default-m.jpeg')}
              height={80}
              width={80}
              borderRadius={16}
              resizeMode="cover"
            />

            <YStack flex={1} gap="$2">
              <Text
                fontSize="$6"
                maxWidth="200"
                fontWeight="700"
                color="#1a1a1a"
                numberOfLines={1}
              >
                {item.title}
              </Text>

              <XStack gap="$4" flexWrap="wrap">

                <XStack gap="$1" alignItems="center">
                  <Heart size={16} color={item.isLiked ? '#e91e63' : '#ccc'} />
                  <Text fontSize="$2" color={item.isLiked ? '#e91e63' : '#888'}>
                    {item.isLiked ? 'Liked' : 'Not liked'}
                  </Text>
                </XStack>

                <Text fontSize="$2" color="#666">
                  ⏱ {FormattedAudio(item.duration)}
                </Text>
              </XStack>
            </YStack>
          </YStack>
        </View>

      ))}
    </ScrollView>
  )
}

export default MusicTabs
