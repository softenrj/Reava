import { getAudioDuration } from '@/Features/hooks/getAudioDurationFormatted'
import { moveToPermanentStorage } from '@/Features/hooks/moveToPermanentStorage'
import { useAppDispatch } from '@/Features/hooks/redux'
import { removeMusic, updateMusic } from '@/redux/slice/music'
import { IMusic } from '@/types/music'
import { API_PATCH_MUSIC, API_REMOVE_MUSIC } from '@/utils/api/APIConstant'
import { deleteApi, patchApi } from '@/utils/endPoints/common'
import { Video } from 'expo-av'
import * as DocumentPicker from 'expo-document-picker'
import { FileAudio, ImageIcon, Pencil, Save, Trash2, VideoIcon, X } from 'lucide-react-native'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { ToastAndroid } from 'react-native'
import {
  Button,
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
  Fieldset,
  Image,
  Input,
  Label,
  ScrollView,
  Text,
  Unspaced,
  XStack,
  YStack,
} from 'tamagui'

type Props = {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  initialData: IMusic
  setMusicNull: Dispatch<SetStateAction<IMusic | null>>
}

interface Doc {
  audio: DocumentPicker.DocumentPickerAsset
  video: DocumentPicker.DocumentPickerAsset
  image: DocumentPicker.DocumentPickerAsset
}

export default function EditMusicDialog({ open, setOpen, initialData, setMusicNull }: Props) {
  const [audio, setAudio] = useState(initialData.audioPath)
  const [video, setVideo] = useState(initialData.videoPath)
  const [image, setImage] = useState(initialData.imagePath)
  const [title, setTitle] = useState(initialData.title)
  const [isLoading, setLoading] = useState(false)
  const [files, setFiles] = useState<Partial<Doc>>({})
  const dispatch = useAppDispatch()
  const [showMedia, setShowMedia] = useState(false)

  useEffect(() => {
    if (open) {
      const timeout = setTimeout(() => setShowMedia(true), 300)
      return () => clearTimeout(timeout)
    } else {
      setShowMedia(false)
    }
  }, [open])

  const pickFile = async (type: 'audio/*' | 'image/*' | 'video/*') => {
    const result = await DocumentPicker.getDocumentAsync({ multiple: false, type })
    if (!result.canceled && result.assets?.length > 0) {
      const file = result.assets[0]
      if (type === 'audio/*') {
        setAudio(file.uri)
        setFiles(prev => ({ ...prev, audio: file }))
      } else if (type === 'video/*') {
        setVideo(file.uri)
        setFiles(prev => ({ ...prev, video: file }))
      } else if (type === 'image/*') {
        setImage(file.uri)
        setFiles(prev => ({ ...prev, image: file }))
      }
    }
  }

  const handleEdit = async () => {
    setLoading(true)

    if (!title || !(audio || files.audio?.uri)) {
      alert('Title and audio are required')
      setLoading(false)
      return
    }

    try {
      const [audioPath, videoPath, imagePath, duration] = await Promise.all([
        files.audio ? moveToPermanentStorage(files.audio) : Promise.resolve(initialData.audioPath),
        files.video ? moveToPermanentStorage(files.video) : Promise.resolve(initialData.videoPath),
        files.image ? moveToPermanentStorage(files.image) : Promise.resolve(initialData.imagePath),
        getAudioDuration(files.audio?.uri || initialData.audioPath),
      ])

      const values: Record<string, string | number> = {
        title,
        audioPath,
        duration,
        videoPath,
        imagePath,
      }

      const updated = await patchApi({
        url: `${API_PATCH_MUSIC}/${initialData._id}`,
        values,
      })

      if (updated) {
        dispatch(updateMusic(updated as IMusic))
        ToastAndroid.show('Music updated 🎵', ToastAndroid.SHORT)
        setOpen(false)
        setMusicNull(null)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }


  const handleRemove = async () => {
    try {
      await deleteApi({ url: API_REMOVE_MUSIC + `/${initialData._id}` })
      dispatch(removeMusic(initialData._id))
      setOpen(false)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen} modal>
      <Dialog.Portal>
        <DialogOverlay key="edit-overlay" backgroundColor="rgba(0,0,0,0.4)" />
        <DialogContent
          bordered
          elevate
          borderRadius="$6"
          padding="$5"
          width="90%"
          maxWidth={500}
          backgroundColor="#fff"
          animation="medium"
          enterStyle={{ y: 10, opacity: 0 }}
          exitStyle={{ y: 10, opacity: 0, scale: 0.95 }}
        >
          <XStack alignItems="center" justifyContent="space-between">
            <XStack alignItems="center" gap="$2">
              <Pencil size={20} color="#4C51BF" />
              <DialogTitle fontSize={18} fontWeight="700">
                Edit Music
              </DialogTitle>
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
            <YStack gap="$4">
              <Fieldset>
                <Label>Title</Label>
                <Input value={title} onChangeText={setTitle} />
              </Fieldset>

              <Fieldset>
                <Label>Audio File</Label>
                <Button icon={FileAudio} onPress={() => pickFile('audio/*')}>
                  Change Audio
                </Button>
                {audio && <Text color="#666">{audio}</Text>}
              </Fieldset>

              <Fieldset>
                <Label>Background Video</Label>
                <Button icon={VideoIcon} onPress={() => pickFile('video/*')}>
                  Change Video
                </Button>
                {showMedia && video && (
                  <Video
                    source={{ uri: video }}
                    useNativeControls
                    style={{ width: '100%', height: 160, borderRadius: 10, marginTop: 10 }}
                  />
                )}
              </Fieldset>

              <Fieldset>
                <Label>Cover Image</Label>
                <Button icon={ImageIcon} onPress={() => pickFile('image/*')}>
                  Change Image
                </Button>
                {showMedia && image && (
                  <Image
                    source={{ uri: image }}
                    width="100%"
                    height={120}
                    borderRadius={10}
                    resizeMode="cover"
                    marginTop={10}
                  />
                )}
              </Fieldset>

              <XStack justifyContent="space-between" gap={8} marginTop="$4">
                <Button icon={Trash2} theme="red" onPress={handleRemove}>
                  Delete
                </Button>
                <Button icon={isLoading ? undefined : Save} theme="green" onPress={handleEdit} disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </XStack>
            </YStack>
          </ScrollView>
        </DialogContent>
      </Dialog.Portal>
    </Dialog>
  )
}
