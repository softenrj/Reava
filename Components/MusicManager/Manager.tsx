import { FormattedAudio } from '@/Features/hooks/getAudioDurationFormatted'
import { useAppSelector } from '@/Features/hooks/redux'
import { IMusic } from '@/types/music'
import { BadgePlus, PencilRuler } from 'lucide-react-native'
import React, { useState } from 'react'
import { Pressable } from 'react-native'
import {
  Avatar,
  Button,
  Heading,
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
const { data: music, isLoading, error } = useMyMusic();

  const handleMusicEdit = (music: IMusic) => {
    setEditMusicData(music)
    setEditMusic(true)
  }


  return (
    <ScrollView padding={8} showsVerticalScrollIndicator={false} height={'100%'}>
      <XStack alignItems='center' justifyContent='space-between'>
        <Heading fontSize={24} fontWeight={'800'} color={'#333333'}>Music Manager</Heading>
        <Button icon={BadgePlus} variant='outlined' onPress={() => setAddMusicOpen(true)}>Add More</Button>
      </XStack>

      <Stack paddingTop={8} gap={6}>
        {music && Array.isArray(music) && music.map((item) => (
          <View
            key={item._id}
            borderWidth={1}
            borderColor={'#8888'}
            padding={12}
            borderRadius={12}
            flexDirection="row"
            alignItems="center"
            gap={12}
            marginTop={5}
          >
            <Avatar borderRadius={12} size="$6">
              <Avatar.Image
                src={item.imagePath || require('@/assets/images/default.jpeg')}
                alt="Playlist Cover"
              />
              <Avatar.Fallback backgroundColor="gray" />
            </Avatar>

            <Stack flex={1}>
              <Text fontWeight="600" fontSize={18}>{item.title}</Text>
              <Text fontSize={14}>Duration: {FormattedAudio(item.duration)}</Text>
            </Stack>

            <Pressable onPress={() => handleMusicEdit(item)}>
              <PencilRuler size={24} color={'#8E2DE2'} />
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
