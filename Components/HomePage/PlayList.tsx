import { useAppDispatch, useAppSelector } from '@/Features/hooks/redux'
import { setPlaylistAndPlay } from '@/redux/slice/playlist'
import { IMusic } from '@/types/music'
import React from 'react'
import { FlatList, Pressable } from 'react-native'
import { Text, View, YStack } from 'tamagui'
import PlayListCard from '../common/PlayListCard'

export default function PlayList({ list, title = "Recently Played", name }: {list: IMusic[], title: string, name: string}) {
  const dispatch = useAppDispatch()
  const currentMusic = useAppSelector(state => state.playList).current
  const handlePlay = (id: string) => {
    if (currentMusic?._id === id) return;
    dispatch(setPlaylistAndPlay({list, id, name}))
  }
  return (
    <YStack>
      <View
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        padding={'$2'}
      >
        <Text fontSize="$7" fontWeight="800" color={'#363636'}>
          { title }
        </Text>
        <Pressable>
          {/* <Text fontSize="$4" fontWeight="500" color="$blue10">
            Show more
          </Text> */}
        </Pressable>
      </View>

      {/* Playlist Scroll */}
      <FlatList
        horizontal
        data={list}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item,index }) => (
          <PlayListCard
            title={item.title}
            changeRequest={() => handlePlay(item._id)}
            duration={item.duration}
            imageUrl={item.imagePath}
          />
        )}
        ItemSeparatorComponent={() => <View width={12} />}
        showsHorizontalScrollIndicator={false}
      />
    </YStack>
  )
}
