import { getAudioDuration } from '@/Features/hooks/getAudioDurationFormatted'
import { moveToPermanentStorage } from '@/Features/hooks/moveToPermanentStorage'
import { useAppDispatch, useAppSelector } from '@/Features/hooks/redux'
import { addMusic } from '@/redux/slice/music'
import { setNewMusic } from '@/redux/slice/playlist'
import { IMusic } from '@/types/music'
import { API_ADD_NEW_MUSIC } from '@/utils/api/APIConstant'
import { postApi } from '@/utils/endPoints/common'
import { Video } from 'expo-av'
import * as DocumentPicker from 'expo-document-picker'
import {
  FileAudio,
  Image as ImageIcon,
  Loader2,
  Music,
  Upload,
  Video as VideoIcon,
  X
} from 'lucide-react-native'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { ScrollView, ToastAndroid } from 'react-native'
import {
  Button,
  Dialog,
  Fieldset,
  Image,
  Input,
  Label,
  Text,
  Unspaced,
  XStack,
  YStack
} from 'tamagui'

export default function AddMusic({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}) {
  const [audio, setAudio] = useState<DocumentPicker.DocumentPickerAsset | null>(null)
  const [video, setVideo] = useState<DocumentPicker.DocumentPickerAsset | null>(null)
  const [image, setImage] = useState<DocumentPicker.DocumentPickerAsset | null>(null)
  const [title, setTitle] = useState('')
  const [isLoading, setLoading] = useState(false)
  const dispatch = useAppDispatch()
  const currentplaylist = useAppSelector(state => state.playList);

  const pickFile = async (type: 'audio/*' | 'image/*' | 'video/*') => {
    const result = await DocumentPicker.getDocumentAsync({ multiple: false, type })
    if (!result.canceled && result.assets.length > 0) {
      const file = result.assets[0]
      if (type === 'audio/*') {
        setAudio(file)
        setTitle(file.name.replace(/\.[^/.]+$/, ''))
      } else if (type === 'image/*') setImage(file)
      else if (type === 'video/*') setVideo(file)
    }
  }

  const handleUpload = async () => {
    try {
      setLoading(true)
      if (!audio) return

      const [audioPath, videoPath, imagePath, duration] = await Promise.all([
        moveToPermanentStorage(audio),
        moveToPermanentStorage(video),
        moveToPermanentStorage(image),
        getAudioDuration(audio.uri)
      ])

      const values: Record<string, string | number> = {
        title: title || audio.name || 'Untitled',
        audioPath,
        duration
      }

      if (videoPath) values.videoPath = videoPath
      if (imagePath) values.imagePath = imagePath

      const addedMusic = await postApi({ url: API_ADD_NEW_MUSIC, values })

      if (addedMusic) {
        dispatch(addMusic(addedMusic as IMusic))
        if (currentplaylist.name === "myMusic") {
          dispatch(setNewMusic(addMusic as any))
        }
        ToastAndroid.show('Music added successfully', ToastAndroid.SHORT)
        setAudio(null)
        setVideo(null)
        setImage(null)
        setTitle('')
        setOpen(false)
      }
    } catch (error) {
      console.error('Upload failed:', error)
      ToastAndroid.show('Upload failed', ToastAndroid.SHORT)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen} modal>
      <Dialog.Portal>
        <Dialog.Overlay key={'unique'} backgroundColor="rgba(0,0,0,0.5)" />
        <Dialog.Content
          bordered
          elevate
          borderRadius="$6"
          padding="$5"
          width="90%"
          maxWidth={500}
          gap="$4"
          backgroundColor="#ffffff"
          animation="quick"
          animationDuration={300}
          enterStyle={{ y: 5, opacity: 0 }}
          exitStyle={{ y: 5, opacity: 0, scale: 0.95 }}
        >
          {/* Header */}
            <XStack alignItems="center" justifyContent="space-between">
              <XStack alignItems="center" gap="$2">
                <Music size={22} color="#4C51BF" />
                <Dialog.Title fontSize={18} fontWeight="700">
                  Add New Music
                </Dialog.Title>
              </XStack>
              <Unspaced>
                <Dialog.Close asChild>
                  <Button icon={X} size="$2" circular variant="outlined" />
                </Dialog.Close>
              </Unspaced>
            </XStack>
            <ScrollView
            style={{ maxHeight: 400 }}
            contentContainerStyle={{ paddingBottom: 16 }}
            showsVerticalScrollIndicator={false}
          >

            {/* Form */}
            <YStack gap="$4">
              {/* Title Field */}
              <Fieldset gap="$2">
                <Label>Title</Label>
                <Input
                  placeholder="Enter track title"
                  value={title}
                  onChangeText={setTitle}
                  backgroundColor="#f9f9f9"
                  borderColor="#d0d0d0"
                />
              </Fieldset>

              {/* Audio Field */}
              <Fieldset gap="$2">
                <Label>Audio File</Label>
                <Button icon={FileAudio} theme="blue" onPress={() => pickFile('audio/*')}>
                  Choose Audio
                </Button>
                {audio && <Text color="#666">{audio.name}</Text>}
              </Fieldset>

              {/* Video Field */}
              <Fieldset gap="$2">
                <Label>Background Video</Label>
                <Button icon={VideoIcon} theme="blue" onPress={() => pickFile('video/*')}>
                  Choose Video
                </Button>
                {video?.uri && (
                  <Video
                    source={{ uri: video.uri }}
                    useNativeControls
                    style={{ width: '100%', height: 180, borderRadius: 10, marginTop: 10 }}
                  />
                )}
              </Fieldset>

              {/* Image Field */}
              <Fieldset gap="$2">
                <Label>Cover Image</Label>
                <Button icon={ImageIcon} theme="blue" onPress={() => pickFile('image/*')}>
                  Choose Image
                </Button>
                {image?.uri && (
                  <Image
                    source={{ uri: image.uri }}
                    width="100%"
                    height={120}
                    borderRadius={10}
                    resizeMode="cover"
                    marginTop={10}
                  />
                )}
              </Fieldset>
            </YStack>

            {/* Footer */}
            <XStack justifyContent="flex-end" gap="$3" marginTop="$4">
              <Dialog.Close asChild>
                <Button theme="gray" disabled={isLoading}>
                  Cancel
                </Button>
              </Dialog.Close>
              <Button
                icon={isLoading ? Loader2 : Upload}
                theme="green"
                onPress={handleUpload}
                disabled={isLoading || !audio}
              >
                {isLoading ? 'Uploading...' : 'Upload'}
              </Button>
            </XStack></ScrollView>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}
