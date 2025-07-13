import { useAppSelector } from '@/Features/hooks/redux'
import { IMusic } from '@/types/music'
import { API_GET_SUGGESTION } from '@/utils/api/APIConstant'
import { useRecentlyPlayed, useTopPlayed } from '@/utils/api/playlist'
import { getApi } from '@/utils/endPoints/common'
import React from 'react'
import { ToastAndroid } from 'react-native'
import { Image, View } from 'tamagui'
import AIButton from './Aibutton'
import PlayList from './PlayList'

export default function Main() {
  const user = useAppSelector(state => state.profileSlice)
  const myMusic = useAppSelector( state => state.muiscSlice)
  const { data: recentlyPlayed = [] } = useRecentlyPlayed();
  const { data: topRated = [] } = useTopPlayed();
  const [aiSuggestion, setAiSuggestion] = React.useState<IMusic[]>([])
  const [isLoading, setIsLoading] = React.useState(false)


  const fetchSuggestedPlayListMusic = async () => {
    try {
      setIsLoading(true)
      const AIResult = await getApi<{message: string, data: IMusic[]}>({
        url: API_GET_SUGGESTION
      })
      if (AIResult?.data) {
        setAiSuggestion(AIResult?.data)
      }
      setIsLoading(false)
    } catch (err) {
      console.log(err);
      ToastAndroid.show('Please Try Again..', 50)
    }
  }
  return (
    <View minHeight={720}>
      <View marginTop="$4" borderRadius="$6" overflow="hidden" width="100%" height="$16" shadowColor="#aaa" shadowOffset={{ width: 4, height: 8 }} shadowOpacity={0.2} elevationAndroid={16}>
        <Image
          objectFit="cover"
          width="100%"
          height="100%"
          alt="Hero Image"
          src={user.cover || require('@/assets/images/homepage/hero.jpg')}
        />
      </View>

      <View onPress={fetchSuggestedPlayListMusic}>
        <AIButton loading={isLoading} />
      </View>

      {
        aiSuggestion.length > 0 && <PlayList name="aiSuggestion" title="Smart Suggestions" list={aiSuggestion} />
      }
      {
        recentlyPlayed.length > 0 && <PlayList name="recently" title='Recently Played' list={recentlyPlayed} />
      }
      {
        topRated.length > 0 && <PlayList name="topRated" title='Top Played' list={topRated} />
      }
      {
        myMusic.length > 0 && <PlayList name="myMusic" title='My Music' list={myMusic} />
      }
    </View>
  )
}
