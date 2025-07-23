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
      dispatch(setPlaylistAndPlay({list: music, id: id, name: name}))
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
        <View onPress={() => handlePlay(item._id)} pressStyle={{scale: 0.98}} key={key}>
          <LinearGradient
          key={key}
          colors={['#090021ff', '#0d002de8', '#0d002de2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: width * 0.86,
            padding: 16,
            borderRadius: 12,
            marginBottom: 16,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 16,
            shadowColor: '#000',
            shadowOpacity: 0.3,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 6 }
          }}
        >
          <Image
            src={item.imagePath ? item.imagePath : require('@/assets/images/default-m.jpeg')}
            height={80}
            width={80}
            borderRadius={18}
            resizeMode="cover"
          />

          <YStack flex={1} gap="$2">
            <Text fontSize="$6" maxWidth={'200'} fontWeight="700" color="white" numberOfLines={1}>
              {item.title}
            </Text>

            <XStack gap="$4" flexWrap="wrap">
              <XStack gap="$1" alignItems="center">
                <Play size={16} color="#ffffffcc" />
                <Text fontSize="$2" color="#f1f1f1">
                  {item.played} plays
                </Text>
              </XStack>

              <XStack gap="$1" alignItems="center">
                <Heart size={16} color={item.isLiked ? '#ffb3c6' : '#ccc'} />
                <Text fontSize="$2" color="#f1f1f1">
                  {item.isLiked ? 'Liked' : 'Not liked'}
                </Text>
              </XStack>

              <Text fontSize="$2" color="#f1f1f1">
                ⏱ {FormattedAudio(item.duration)}
              </Text>
            </XStack>
          </YStack>
        </LinearGradient>
        </View>
      ))}
    </ScrollView>
  )
}

export default MusicTabs
