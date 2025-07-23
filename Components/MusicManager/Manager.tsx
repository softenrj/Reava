import { FormattedAudio } from '@/Features/hooks/getAudioDurationFormatted'
import { useAppSelector } from '@/Features/hooks/redux'
import { IMusic } from '@/types/music'
import { BadgePlus, Command, Settings2 } from 'lucide-react-native'
import React, { useState } from 'react'
import { Pressable } from 'react-native'
import {
  Button,
  Heading,
  Image,
  ScrollView,
  Stack,
  Text,
  View,
  XStack
} from 'tamagui'
import AddMusic from './AddMusic'
import EditMusic from './EditMusic'

export default function Manager() {
  const [addMusic, setAddMusicOpen] = useState<boolean>(false)
  const [editMusic, setEditMusic] = useState<boolean>(false)
  const [editMusicData, setEditMusicData] = useState<IMusic | null>(null)

  const music = useAppSelector(state => state.muiscSlice)

  const handleMusicEdit = (music: IMusic) => {
    setEditMusicData(music)
    setEditMusic(true)
  }


  return (
    <ScrollView padding={8} showsVerticalScrollIndicator={false} height={'100%'}>
      <XStack alignItems='center' justifyContent='space-between' paddingBottom={'$2'}>
        <XStack alignItems="center" gap="$2">
          <Command size={26} color="#444" />
          <Heading fontWeight="700" size="$7" color="rgba(10, 0, 73, 1)">
            Manager
          </Heading>
        </XStack>
        <Button icon={BadgePlus} variant='outlined' onPress={() => setAddMusicOpen(true)}>Add More</Button>
      </XStack>

      <Stack paddingTop={8} gap={6}>
        {music && Array.isArray(music) && music.map((item, key) => (
          <View
            key={`${item.title}-${item.audioPath}-${key}`}
            borderWidth={1}
            borderColor={'#8888'}
            padding={8}
            borderRadius={12}
            flexDirection="row"
            alignItems="center"
            gap={12}
            marginTop={5}
          >
            <Image
              source={
                item?.imagePath
                  ? { uri: item.imagePath }
                  : require('@/assets/images/default-m.jpeg')
              } width={65} height={65} borderRadius={12} />

            <Stack flex={1}>
              <Text fontWeight="600" fontSize={18} numberOfLines={2} maxWidth={'90%'}>{item.title}</Text>
              <Text fontSize={14} color={'rgba(0, 0, 0, 0.75)'}>Duration: {FormattedAudio(item.duration)}</Text>
            </Stack>

            <Pressable onPress={() => handleMusicEdit(item)}>
              <Settings2 size={24} color={'#120083dc'} />
            </Pressable>
          </View>
        ))}
      </Stack>

      {/* Modals */}
      {editMusicData && (
        <EditMusic setMusicNull={setEditMusicData} open={editMusic} initialData={editMusicData} setOpen={setEditMusic} />
      )}
      <AddMusic open={addMusic} setOpen={setAddMusicOpen} />
    </ScrollView>
  )
}
